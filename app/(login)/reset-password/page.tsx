"use client";

// Hooks
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
// Schemas
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordSchema from "@/app/utils/schemas/PasswordSchema";
// Utils
import { createClient } from "@/app/lib/supabase/client";
// Components
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function ResetPassword() {
  const supabase = createClient();
  const router = useRouter();

  const [authBg, setAuthBg] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  const methods = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(PasswordSchema),
    mode: "onChange"
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      isValid,
      errors,
      isSubmitting
    }
  } = methods;
  const form = watch();

  // Password visibility toggle
  function handleClickShowPassword() {
    setShowPassword((show) => !show)
  };

  // Prevent default on password visibility toggle
  function handleMouseDownPassword(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
  };

  // Form submit handler
  async function onSubmit(data: {
    password: string;
    confirmPassword: string;
  }) {
    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setAlertInfo({
        type: "error",
        message: "Passwords do not match! Please try again."
      });
      setShowAlert(true);
    }

    try {
      const {
        data: resetData,
        error
      } = await supabase
        .auth
        .updateUser({
        password: data.password,
      });
  
      if (resetData) {
        setAlertInfo({
          type: "success",
          message: "Success! Your password has been reset. Redirecting to login..."
        });
        
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
  
        router.push("/login");
      }
      if (error) console.log(error);
    } catch (error) {
      setAlertInfo({
        type: "error",
        message: "An error occurred. Please try again."
      });
      setShowAlert(true);
    };
  };

  // Randomize the background image
  useEffect(() => {
    if (authBg !== null) return;
    const randomBg = Math.floor(Math.random() * 10) + 1;
    setAuthBg(randomBg);
  }, []);

  // Check if passwords match
  useEffect(() => {
    if (form.password !== form.confirmPassword) {
      setAlertInfo({
        type: "error",
        message: "Passwords do not match! Please try again."
      });
      setShowAlert(true);
    } else if (
        form.password === form.confirmPassword &&
        form.password !== "" && form.confirmPassword !== "" &&
        form.password.length >= 8 && form.confirmPassword.length >= 8
      ) {
      setAlertInfo({
        type: "success",
        message: "Passwords match!"
      });
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [form.password, form.confirmPassword]);

  return (
    <Box
      id="reset-password-outer-container"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
      className="
        flex
        flex-col
        justify-center
        items-center
        lg:items-start
        w-full
        h-[100vh]
        bg-neutral-950
        lg:px-48
        px-8
      "
    >
      <Image
        src={authBg ? `/images/auth-bg/nexus-auth-bg-${authBg}.jpg` : "/images/auth-bg/nexus-auth-bg-1.jpg"}
        alt="Nexus background"
        fill
        style={{
          objectFit: "cover"
        }}
        className="
          opacity-25
        "
      />
      <Box
        id="reset-password-inner-container"
        className="
          flex
          flex-col
          justify-start
          items-center
          w-full
          max-w-md
          p-4
          gap-4
          rounded-md
          bg-neutral-800/90
          backdrop-blur-sm
          border
          border-neutral-700
          shadow-xl
          shadow-neutral-950/50
          lg:shadow-neutral-950/70
          z-10
        "
      >
        <Box
          id="reset-password--header-container"
          className="
            flex
            flex-col
            justify-center
            items-center
            w-full
            gap-2
          "
        >
          <Typography
            variant="h4"
            className="
              font-medium
              text-white
            "
          >
            Reset password
          </Typography>
          <Typography
            variant="subtitle1"
            className="
              font-light
              text-neutral-400
            "
          >
            Enter your new password to log in
          </Typography>
        </Box>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full"
          >
            <Box
              id="reset-password-inputs-container"
              className="
                flex
                flex-col
                justify-center
                items-center
                w-full
                gap-4
              "
            >
              {/* Password Input */}
              <FormControl
                variant="outlined"
                className="w-full"
              >
                <InputLabel
                  htmlFor="password-input"
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password-input"
                  label="Password"
                  placeholder="••••••••"
                  {...register("password")}
                  error={Boolean(errors.password)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  className="
                    w-full
                  "
                />
              </FormControl>
              {errors.password && (
                <Typography
                  color="error"
                  variant="caption"
                  display="block"
                >
                  {errors.password.message}
                </Typography>
              )}

              {/* Confirm Password Input */}
              <FormControl
                variant="outlined"
                className="w-full"
              >
                <InputLabel
                  htmlFor="confirm-password-input"
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  id="confirm-password-input"
                  label="Confirm password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  error={Boolean(errors.password)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  className="
                    w-full
                  "
                />
              </FormControl>
              {errors.password && (
                <Typography
                  color="error"
                  variant="caption"
                  display="block"
                >
                  {errors.password.message}
                </Typography>
              )}

              {showAlert && (<Alert
                severity={alertInfo?.type}
                className="w-full"
              >
                {alertInfo?.message}
              </Alert>)}

              {/* Form submit button */}
              <Button
                type="submit"
                variant="outlined"
                disabled={!isValid || isSubmitting}
                color={isValid ? "success" : "primary"}
                size="large"
                className="
                  w-full
                "
              >
                Reset password
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
};