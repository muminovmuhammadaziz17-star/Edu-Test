
// EDU TEST - STUDENT DASHBOARD

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");
const logoutBtn = document.getElementById("logoutBtn");

// Mobil menyu
mobileMenu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// Ismni ko'rsatish (hozircha demo)
const demoName = "O‘quvchi";

document.getElementById("welcomeName").textContent = demoName;
document.getElementById("headerName").textContent = demoName;

// Mobil qurilmada menyu tanlanganda yopish
document.querySelectorAll(".menu-link").forEach(link => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 750) {
            sidebar.classList.remove("open");
        }
    });
});

// Hozircha demo rejimida chiqish
logoutBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

// Demo statistikalar
document.getElementById("totalPoints").textContent = "0";
document.getElementById("completedTests").textContent = "0";
document.getElementById("averageScore").textContent = "0%";

console.log("EDU TEST Student Dashboard loaded!");

import { supabase } from "./supabase.js";

const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) location.href = "index.html";

const { data: profile } = await supabase
  .from("profiles")
  .select("full_name, role")
  .eq("id", user.id)
  .single();

if (profile) {
  document.querySelector("#studentName").textContent =
    profile.full_name;
}

document.querySelector("#logout")?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  location.href = "index.html";
});
