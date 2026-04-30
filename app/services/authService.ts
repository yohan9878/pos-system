export const getUser = async (username: string, password: string) => {
  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    // const user = await res.json();
    const token = await res.text();
    // localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    return token;
  } catch (err) {
    alert("Invalid login credentials");
    console.error("Login error:", err);
  }
};
