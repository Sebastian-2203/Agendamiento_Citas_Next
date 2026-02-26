// Mock Data / State
const state = {
    currentUser: null, // 'teacher' | 'psychologist' | null
    slots: [], // Citas serán dinámicas ahora
    bookings: [], // Almacenar reservas { id, date, time, bookedBy, reason }
    selectedDate: null, // Fecha seleccionada YYYY-MM-DD
    selectedSlot: null,
    calendar: {
        year: 2026,
        month: 1 // Febrero (0-indexed)
    },
    psychProfile: {
        name: 'Dra. Laura Pérez',
        avatarUrl: 'https://i.pravatar.cc/150?img=47'
    }
};

// Horarios de Lunes a Viernes excluyendo almuerzo (1:00 PM - 2:00 PM)
const dailySchedule = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM'
];

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const daysWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// DOM Elements
const views = {
    login: document.getElementById('login-view'),
    teacher: document.getElementById('teacher-view'),
    psych: document.getElementById('psych-view'),
    profile: document.getElementById('profile-view')
};

const navMenu = document.getElementById('nav-menu');
const navAgendaBtn = document.getElementById('nav-agenda-btn');
const navProfileBtn = document.getElementById('nav-profile-btn');
const userDisplay = document.getElementById('user-display');
const userRoleDisplay = document.getElementById('user-role-display');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');

// Profile Elements
const profileForm = document.getElementById('profile-form');
const profileNameInput = document.getElementById('profile-name');
const profileImgUpload = document.getElementById('profile-img-upload');
const profilePreviewImg = document.getElementById('profile-preview-img');

// Login Elements
const loginSelection = document.getElementById('login-selection');
const psychLoginForm = document.getElementById('psych-login-form');
const showPsychLoginBtn = document.getElementById('show-psych-login-btn');
const backToSelectionBtn = document.getElementById('back-to-selection-btn');
const loginErrorMsg = document.getElementById('login-error-msg');

// Calendar Elements
const calendarHeaderDisplay = document.getElementById('current-month-year');
const calendarDaysGrid = document.getElementById('calendar-days');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');
const slotsContainer = document.getElementById('slots-container');
const timeSlotsGrid = document.getElementById('time-slots');

const scheduleList = document.getElementById('schedule-list');
const emptyScheduleCard = document.getElementById('empty-schedule-card');
const upcomingDateHeader = document.getElementById('upcoming-date-header');
const bookingModal = document.getElementById('booking-modal');
const modalSlotInfo = document.getElementById('modal-slot-info');
const bookingForm = document.getElementById('booking-form');

const cancelModal = document.getElementById('cancel-modal');
const abortCancelBtn = document.getElementById('abort-cancel-btn');
const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
let pendingCancelId = null;

// Initialization
function init() {
    setupEventListeners();

    // Set current date if testing today, but let's default to Feb 2026 as requested
    const today = new Date();
    if (today.getFullYear() >= 2026) {
        state.calendar.year = today.getFullYear();
        state.calendar.month = today.getMonth();
    }

    updateUI();
}

// Event Listeners
function setupEventListeners() {
    // Login Views
    document.getElementById('login-teacher-btn').addEventListener('click', () => login('teacher'));

    showPsychLoginBtn.addEventListener('click', () => {
        loginSelection.classList.add('hidden');
        psychLoginForm.classList.remove('hidden');
        loginErrorMsg.style.display = 'none';
        document.getElementById('psych-username').value = '';
        document.getElementById('psych-password').value = '';
    });

    backToSelectionBtn.addEventListener('click', () => {
        psychLoginForm.classList.add('hidden');
        loginSelection.classList.remove('hidden');
    });

    psychLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('psych-username').value;
        const pass = document.getElementById('psych-password').value;

        if (user === 'admin' && pass === '1234') {
            login('psychologist');
        } else {
            loginErrorMsg.style.display = 'block';
        }
    });

    // Psych Nav Links
    if (navAgendaBtn && navProfileBtn) {
        navAgendaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navAgendaBtn.classList.add('active');
            navProfileBtn.classList.remove('active');
            views.profile.classList.add('hidden');
            views.profile.classList.remove('active');
            views.psych.classList.remove('hidden');
            views.psych.classList.add('active');
        });
        navProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navProfileBtn.classList.add('active');
            navAgendaBtn.classList.remove('active');
            views.psych.classList.add('hidden');
            views.psych.classList.remove('active');
            views.profile.classList.remove('hidden');
            views.profile.classList.add('active');

            // Populate form
            profileNameInput.value = state.psychProfile.name;
            profilePreviewImg.src = state.psychProfile.avatarUrl;
        });
    }

    if (profileImgUpload) {
        profileImgUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (evt) {
                    profilePreviewImg.src = evt.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            state.psychProfile.name = profileNameInput.value;
            state.psychProfile.avatarUrl = profilePreviewImg.src;

            updateUI(); // This will refresh the header
            alert('Perfil actualizado correctamente');
        });
    }

    // Calendar Navigation
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    // Logout
    logoutBtn.addEventListener('click', logout);

    // Modal Actions
    document.getElementById('cancel-booking-btn').addEventListener('click', closeModal);
    bookingForm.addEventListener('submit', handleBookingSubmit);

    // Cancel Modal Actions
    if (abortCancelBtn) {
        abortCancelBtn.addEventListener('click', () => {
            cancelModal.classList.add('hidden');
            pendingCancelId = null;
        });
    }

    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', () => {
            if (pendingCancelId) {
                state.bookings = state.bookings.filter(b => b.id !== pendingCancelId);
                renderPsychView();
                cancelModal.classList.add('hidden');
                pendingCancelId = null;
            }
        });
    }

    // Confirm booking from slots
    const confirmBtn = document.getElementById('confirm-booking-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (state.selectedSlot) {
                openBookingModal(state.selectedSlot);
            }
        });
    }
}

// Actions
function login(userType) {
    state.currentUser = userType;
    updateUI();
}

function logout() {
    state.currentUser = null;
    state.selectedDate = null;
    slotsContainer.classList.add('hidden');

    const confirmBtn = document.getElementById('confirm-booking-btn');
    if (confirmBtn) confirmBtn.style.display = 'none';

    // Reset login view state
    psychLoginForm.classList.add('hidden');
    loginSelection.classList.remove('hidden');

    // Reset nav buttons
    if (navAgendaBtn) navAgendaBtn.classList.add('active');
    if (navProfileBtn) navProfileBtn.classList.remove('active');

    updateUI();
}

function changeMonth(delta) {
    state.calendar.month += delta;
    if (state.calendar.month > 11) {
        state.calendar.month = 0;
        state.calendar.year++;
    } else if (state.calendar.month < 0) {
        state.calendar.month = 11;
        state.calendar.year--;
    }
    state.selectedDate = null;
    slotsContainer.classList.add('hidden');

    const confirmBtn = document.getElementById('confirm-booking-btn');
    if (confirmBtn) confirmBtn.style.display = 'none';

    renderCalendar();
}

function selectDate(dateStr) {
    state.selectedDate = dateStr;
    const [y, m, d] = dateStr.split('-');

    document.getElementById('selected-date-title').textContent = `Elegí para el ${parseInt(d)} de ${months[parseInt(m) - 1]}`;

    slotsContainer.classList.remove('hidden');

    const confirmBtn = document.getElementById('confirm-booking-btn');
    if (confirmBtn) confirmBtn.style.display = 'none';
    state.selectedSlot = null;

    // Update selected styling
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    const dayEl = document.querySelector(`[data-date="${dateStr}"]`);
    if (dayEl) dayEl.classList.add('selected');

    renderSlots();
}

function openBookingModal(time) {
    state.selectedSlot = time;
    const [y, m, d] = state.selectedDate.split('-');
    modalSlotInfo.textContent = `${parseInt(d)} de ${months[parseInt(m) - 1]} a las ${time}`;
    bookingModal.classList.remove('hidden');
}

function closeModal() {
    bookingModal.classList.add('hidden');
    state.selectedSlot = null;
    bookingForm.reset();
}

function handleBookingSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('teacher-name').value;
    const cedula = document.getElementById('teacher-cedula').value;
    const sede = document.getElementById('teacher-sede').value;
    const reason = document.getElementById('booking-reason').value;

    if (state.selectedDate && state.selectedSlot) {
        const id = Date.now().toString();

        state.bookings.push({
            id,
            date: state.selectedDate,
            time: state.selectedSlot,
            bookedBy: name,
            cedula: cedula,
            sede: sede,
            reason: reason,
            status: 'pending'
        });

        alert('¡Cita agendada con éxito!');
        closeModal();
        renderSlots(); // Refresh grid
    }
}

// Render Logic
function updateUI() {
    Object.values(views).forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });

    if (!state.currentUser) {
        views.login.classList.remove('hidden');
        views.login.classList.add('active');
        navMenu.classList.add('hidden');
    } else {
        navMenu.classList.remove('hidden');
        userDisplay.textContent = state.currentUser === 'teacher' ? 'Paciente' : state.psychProfile.name;
        userAvatar.src = state.currentUser === 'teacher' ? 'https://i.pravatar.cc/150?img=1' : state.psychProfile.avatarUrl;
        if (userRoleDisplay) userRoleDisplay.textContent = state.currentUser === 'teacher' ? 'Modo Paciente' : 'Modo Psicóloga';

        if (state.currentUser === 'teacher') {
            views.teacher.classList.remove('hidden');
            views.teacher.classList.add('active');
            renderCalendar();
            // Hide psych nav links
            if (navAgendaBtn) navAgendaBtn.style.display = 'none';
            if (navProfileBtn) navProfileBtn.style.display = 'none';
        } else {
            // Only show agenda since profile requires clicking nav link
            views.psych.classList.remove('hidden');
            views.psych.classList.add('active');
            renderPsychView();
            // Show psych nav links
            if (navAgendaBtn) {
                navAgendaBtn.style.display = 'inline-block';
                navAgendaBtn.classList.add('active');
            }
            if (navProfileBtn) {
                navProfileBtn.style.display = 'inline-block';
                navProfileBtn.classList.remove('active');
            }
        }
    }
}

function renderCalendar() {
    calendarHeaderDisplay.textContent = `${months[state.calendar.month]} ${state.calendar.year}`;
    calendarDaysGrid.innerHTML = '';

    const firstDay = new Date(state.calendar.year, state.calendar.month, 1).getDay();
    const daysInMonth = new Date(state.calendar.year, state.calendar.month + 1, 0).getDate();

    // Offset for Monday start (0=Sun, 1=Mon ... 6=Sat)
    let startOffset = firstDay === 0 ? 6 : firstDay - 1;

    // Empty spaces
    for (let i = 0; i < startOffset; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-day empty';
        calendarDaysGrid.appendChild(emptyDiv);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        const dateStr = `${state.calendar.year}-${String(state.calendar.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Check day of week (0=Sun, 1=Mon ... 6=Sat)
        const dateObj = new Date(state.calendar.year, state.calendar.month, day);
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;

        if (isWeekend) {
            dayDiv.classList.add('disabled');
        } else {
            dayDiv.dataset.date = dateStr;
            if (state.selectedDate === dateStr) {
                dayDiv.classList.add('selected');
            }
            dayDiv.addEventListener('click', () => selectDate(dateStr));
        }

        calendarDaysGrid.appendChild(dayDiv);
    }
}

function renderSlots() {
    timeSlotsGrid.innerHTML = '';

    // Generate slots for the day
    const dayBookings = state.bookings.filter(b => b.date === state.selectedDate);

    dailySchedule.forEach(time => {
        const booking = dayBookings.find(b => b.time === time);
        const isBooked = !!booking;

        const card = document.createElement('div');
        card.className = `slot-card ${isBooked ? 'booked' : ''}`;

        card.innerHTML = `
            <div class="slot-time">${time}</div>
            <div class="slot-status">
                ${isBooked ? 'Ocupado' : 'Disponibles'}
            </div>
        `;

        if (!isBooked) {
            card.addEventListener('click', () => {
                document.querySelectorAll('.slot-card').forEach(el => el.classList.remove('selected'));
                card.classList.add('selected');
                state.selectedSlot = time;
                document.getElementById('confirm-booking-btn').style.display = 'block';
            });
        }

        timeSlotsGrid.appendChild(card);
    });
}

function renderPsychView() {
    scheduleList.innerHTML = '';

    // Sort bookings by date and time
    const sortedBookings = [...state.bookings].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
    });

    if (sortedBookings.length === 0) {
        scheduleList.classList.add('hidden');
        emptyScheduleCard.classList.remove('hidden');
        upcomingDateHeader.textContent = '';
        return;
    }

    scheduleList.classList.remove('hidden');
    emptyScheduleCard.classList.add('hidden');

    // Muestra la fecha del primer booking para la cabecera
    const firstBooking = sortedBookings[0];
    const [y, m, d] = firstBooking.date.split('-');
    const dateObj = new Date(y, m - 1, d);
    upcomingDateHeader.textContent = `${daysWeek[dateObj.getDay()]} ${parseInt(d)} de ${months[parseInt(m) - 1]}`;

    sortedBookings.forEach(booking => {
        const isDone = booking.status === 'done';

        const item = document.createElement('div');
        item.className = `schedule-item ${isDone ? 'status-done' : ''}`;

        let actionsHtml = '';
        if (!isDone) {
            actionsHtml = `
            <div class="schedule-actions">
                <button class="btn-cancel-appt" onclick="window.cancelBooking('${booking.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    Cancelar cita
                </button>
            </div>
            `;
        } else {
            actionsHtml = `
            <div class="schedule-actions" style="color: var(--success-color); font-weight: 600; font-size: 0.9rem;">
                Completada
            </div>
            `;
        }

        // Random avatar based on name length for demo
        const avatarSeed = booking.bookedBy.length;

        item.innerHTML = `
            <div class="schedule-patient-info">
                <img src="https://i.pravatar.cc/150?u=${avatarSeed}" alt="Patient" class="patient-avatar">
                <div class="patient-details">
                    <span class="patient-name">${booking.bookedBy}</span>
                    <span class="patient-time">${booking.time} - ${(parseInt(booking.time) + 1).toString().padStart(2, '0')}:${booking.time.split(':')[1]}</span>
                </div>
            </div>
            ${actionsHtml}
        `;
        scheduleList.appendChild(item);
    });
}

window.markDone = function (id) {
    const booking = state.bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'done';
        renderPsychView();
    }
};

window.cancelBooking = function (id) {
    pendingCancelId = id;
    if (cancelModal) cancelModal.classList.remove('hidden');
};

// Start
init();

