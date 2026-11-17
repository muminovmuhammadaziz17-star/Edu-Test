
import { supabase } from "./supabase.js";

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const nameInput = document.querySelector("#name");

document.querySelector("#loginBtn")?.addEventListener("click", async (e) => {
  e.preventDefault();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value
  });

  if (error) return alert(error.message);

  location.href = "dashboard.html";
});

document.querySelector("#registerBtn")?.addEventListener("click", async (e) => {
  e.preventDefault();

  const fullName = nameInput.value.trim();

  if (!fullName) return alert("Ismingizni kiriting");

  const { data, error } = await supabase.auth.signUp({
    email: email.value.trim(),
    password: password.value,
    options: {
      data: { full_name: fullName }
    }
  });

  if (error) return alert(error.message);

  if (data.user && data.session) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        full_name: fullName,
        role: "student"
      });

    if (profileError) return alert(profileError.message);
  }

  alert("Ro‘yxatdan o‘tish yakunlandi. Emailingizni tasdiqlang.");
});
