import { setUserData } from "../MainStore/Slice/LoginReducer/LoginReducer";

export const appId = "rzp_test_bTjpERvbZPG3xC";
export const secret = "KTegFbor4OD6gsVzLywst6IJ";

export const signupUser = async (
  name,
  email,
  password,
  confirmPassword,
  contact,
  setName,
  setEmail,
  setPassword,
  setConfirmPassword,
  setContact,
  setOpen,
  setMessage
) => {
  const body = { name, email, password, confirmPassword, contact };

  if (!(name && email && password && confirmPassword && contact)) {
    alert("Field should not be Empty!");
  }

  if (!(password === confirmPassword)) {
    alert("Password is not matching!");
  }
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch("http://localhost:8000/signup", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });
  if (response.status === 200) {
    setMessage("Account Created!");
    setOpen(true);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setContact("");
  }

  if (response.status === 400) {
    setMessage("Email Already Exists! Please try different Email.");
    setOpen(true);
  }
};

export const loginUser = async (
  email,
  password,
  navigate,
  dispatch,
  setUserData
) => {
  try {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.status === 200) {
      localStorage.setItem("token", data.token);
      dispatch(setUserData({ userdata: data.data }));
      navigate("/home");
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    alert("Internal server error");
  }
};

export const retriveUser = (dispatch) => {
  const token = window.localStorage.getItem("token");

  if (token) {
    const tokenPayload = token.split(".")[1];
    const decodedPayload = decodeURIComponent(
      atob(tokenPayload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const payloadData = JSON.parse(decodedPayload);
    dispatch(setUserData({ userdata: payloadData }));
    return payloadData;
  }
};