import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/utils/api"; // ✅ FIXED
import { toast } from "sonner";
import auth from "../assets/auth.jpg";

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/v1/user/register",
        user
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex h-screen md:pt-14 md:h-[760px]">

      <div className="hidden md:block">
        <img src={auth} alt="" className="h-[700px]" />
      </div>

      <div className="flex justify-center items-center flex-1 px-4 md:px-0">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800">

          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Create an account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="flex gap-3">
                <Input name="firstName" placeholder="First Name" onChange={handleChange} />
                <Input name="lastName" placeholder="Last Name" onChange={handleChange} />
              </div>

              <Input name="email" placeholder="Email" onChange={handleChange} />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <Button className="w-full">Signup</Button>

              <p className="text-center">
                Already have account?{" "}
                <Link to="/login" className="underline">
                  Login
                </Link>
              </p>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;