import axiosClient from "../axios-client.js";

export const loginUser = async (email, password, setUser, setToken, navigate, setMessage, setLoading) => {
  setLoading(true);
  setMessage(null);

  const payload = { email, password };

  try {
    const { data } = await axiosClient.post("/login", payload);
    setUser(data.user);
    setToken(data.token);

    // Redirect based on role
    if (data.user.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    const response = err.response;
    if (response && response.status === 422) {
      setMessage(response.data.message);
    }
  } finally {
    setLoading(false);
  }
};

export const signupUser = async (name, email, password, passwordConfirmation, role, setUser, setToken, setErrors, setLoading) => {
    setLoading(true);
    setErrors(null);
  
    const payload = {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      role,
    };
  
    try {
      const { data } = await axiosClient.post("/signup", payload);
      setUser(data.user);
      setToken(data.token);
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setErrors(response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };