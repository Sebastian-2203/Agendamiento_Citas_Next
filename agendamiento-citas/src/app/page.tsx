"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import LoginView from "./components/LoginView";
import PatientView from "./components/PatientView";
import PsychologistView from "./components/PsychologistView";
import ProfileView from "./components/ProfileView";
import TeacherProfileForm from "./components/TeacherProfileForm";
import ProfeEnLineaView from "./components/ProfeEnLineaView";
import CapsulesView from "./components/CapsulesView";

import AdminCapsulesView from "./components/AdminCapsulesView";
import { Capsule } from "./components/CapsulesView";

export type UserType = "teacher" | "psychologist" | null;

export interface Booking {
  id: string;
  date: string;
  time: string;
  bookedBy: string;
  cedula: string;
  school: string;
  sede: string;
  reason: string;
  status: string;
}

export interface PsychProfile {
  name: string;
  avatarUrl: string;
}

export interface TeacherProfile {
  name: string;
  cedula: string;
  school: string;
  sede: string;
  isUrgent: boolean;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserType>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [psychProfile, setPsychProfile] = useState<PsychProfile>({
    name: "Cargando...",
    avatarUrl: "",
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"agenda" | "profile" | "capsules">("agenda");
  const [showCapsules, setShowCapsules] = useState(false);
  const [showProfeEnLinea, setShowProfeEnLinea] = useState(false);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [, setIsCapsulesLoading] = useState(false);
  const [profeEnLineaImageUrl, setProfeEnLineaImageUrl] = useState("");

  const fetchCapsules = async () => {
    setIsCapsulesLoading(true);
    try {
      const [capsulesRes, profeRes, profileRes] = await Promise.all([
        fetch('/api/capsules'),
        fetch('/api/settings/profe-en-linea'),
        fetch('/api/settings/profile')
      ]);

      if (capsulesRes.ok) {
        const data = await capsulesRes.json();
        if (Array.isArray(data)) {
          setCapsules(data);
        }
      }

      if (profeRes.ok) {
        const profeData = await profeRes.json();
        if (profeData && typeof profeData.imageUrl === 'string') {
          setProfeEnLineaImageUrl(profeData.imageUrl);
        }
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData && profileData.name) {
          setPsychProfile({
            name: profileData.name,
            avatarUrl: profileData.avatarUrl || "https://i.pravatar.cc/150?u=psychologist",
          });
        } else {
          // Default si no hay nada guardado
          setPsychProfile({
            name: "Psicóloga",
            avatarUrl: "https://i.pravatar.cc/150?u=psychologist",
          });
        }
      }
    } catch (e) {
      console.error("Error fetching data from API", e);
    } finally {
      setIsCapsulesLoading(false);
    }
  };

  // Load from Vercel KV API on mount
  useEffect(() => {
    fetchCapsules();
  }, []);

  const handleLogin = (role: UserType) => {
    setCurrentUser(role);
    setActiveTab("agenda");
    setShowCapsules(false);
    setShowProfeEnLinea(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTeacherProfile(null);
    setActiveTab("agenda");
    setShowCapsules(false);
    setShowProfeEnLinea(false);
  };

  if (showCapsules) {
    return <CapsulesView capsules={capsules} onBack={() => setShowCapsules(false)} />;
  }

  if (showProfeEnLinea) {
    return <ProfeEnLineaView onBack={() => setShowProfeEnLinea(false)} imageUrl={profeEnLineaImageUrl} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Header
        currentUser={currentUser}
        psychProfile={psychProfile}
        activeTab={activeTab as "agenda" | "profile"}
        onTabChange={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
      />

      <main className="container" style={{ flex: 1, zIndex: 1 }}>
        {!currentUser && <LoginView
          onLogin={handleLogin}
          onViewCapsules={() => setShowCapsules(true)}
          onViewProfeEnLinea={() => setShowProfeEnLinea(true)}
        />}

        {currentUser === "teacher" && !teacherProfile && (
          <TeacherProfileForm onComplete={setTeacherProfile} />
        )}

        {currentUser === "teacher" && teacherProfile && (
          <PatientView
            bookings={bookings}
            teacherProfile={teacherProfile}
            onBook={(booking) => setBookings([...bookings, booking])}
          />
        )}

        {currentUser === "psychologist" && activeTab === "agenda" && (
          <PsychologistView
            psychProfile={psychProfile}
            bookings={bookings}
            onUpdateBookings={setBookings}
          />
        )}

        {currentUser === "psychologist" && activeTab === "profile" && (
          <ProfileView
            profile={psychProfile}
            onSave={setPsychProfile}
          />
        )}

        {currentUser === "psychologist" && activeTab === "capsules" && (
          <AdminCapsulesView
            capsules={capsules}
            onForceReload={fetchCapsules}
            profeEnLineaImageUrl={profeEnLineaImageUrl}
          />
        )}
      </main>
    </div>
  );
}
