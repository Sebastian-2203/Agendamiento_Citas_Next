"use client";

import { useState } from "react";
import Header from "./components/Header";
import LoginView from "./components/LoginView";
import PatientView from "./components/PatientView";
import PsychologistView from "./components/PsychologistView";
import ProfileView from "./components/ProfileView";
import TeacherProfileForm from "./components/TeacherProfileForm";
import CapsulesView from "./components/CapsulesView";

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
    name: "Dra. Laura Pérez",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"agenda" | "profile" | "capsules">("agenda");

  const handleLogin = (role: UserType) => {
    setCurrentUser(role);
    setActiveTab("agenda");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTeacherProfile(null);
    setActiveTab("agenda");
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        psychProfile={psychProfile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="container">
        {!currentUser && <LoginView onLogin={handleLogin} />}

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

        {currentUser && activeTab === "capsules" && (
          <CapsulesView />
        )}
      </main>
    </>
  );
}
