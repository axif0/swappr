import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [errorMessage, seterrorMessage] = useState("");
  const { signUpWithGmail, login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsOpen(false);
    const email = data.email;
    const password = data.password;
    login(email, password)
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: data.name,
          email: data.email,
        };
        axios
          .post("https://swapper-server.onrender.com/users", userInfor)
          .then((response) => {
            alert("Signin successful!");
            setIsOpen(false); // Close the modal
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        seterrorMessage("Please provide valid email & password!");
      });
    reset();
  };

  // login with google
  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: result?.user?.displayName,
          email: result?.user?.email,
        };
        axios
          .post("https://swapper-server.onrender.com/users", userInfor)
          .then((response) => {
            alert("Signin successful!");
            setIsOpen(false); // Close the modal
            navigate("/");
          });
      })
      .catch((error) => console.log(error));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex-col justify-center mt-0">
          <form
            className="card-body"
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="font-bold text-lg">Please Login!</h3>
            <p></p>
            <div className="form-control">
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered"
                {...register("email")}
              />
            </div>
            <div className="form-control">
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
                {...register("password", { required: true })}
              />
            </div>
            {errorMessage ? (
              <p className="text-red text-xs italic">
                Provide a correct username & password.
              </p>
            ) : (
              ""
            )}
            <div className="form-control mt-4">
              <input
                type="submit"
                className="btn bg-green text-white"
                value="Login"
              />
            </div>
            <div
              htmlFor="my_modal_5"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </div>
            <p className="text-center my-2">
              Do not have an account?
              <Link to="/signup" className="text-green ml-1">
                Signup Now
              </Link>
            </p>
          </form>
          <div className="text-center space-x-3 mb-5">
            <p> Or, Login with   <button
              onClick={handleRegister}
              className="btn btn-circle hover:bg-green hover:text-thewhite"
            >
              <FaGoogle />
            </button>  </p>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
