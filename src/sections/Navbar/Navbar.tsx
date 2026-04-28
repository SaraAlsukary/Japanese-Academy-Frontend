import "./Navbar.css";
import Logo from "../../assets/Logo/الشعار-2-png.png";
import { FaHome } from "react-icons/fa";
import { useEffect, useState } from "react";
import { MdLibraryBooks } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { FaBook } from "react-icons/fa6";
import { FaUserGroup } from "react-icons/fa6";
import { GrMoreVertical } from "react-icons/gr";
import { FaMicrophoneLines } from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import APIURL from "../../api/constants";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [user, setUser] = useState(
    localStorage.getItem("token") ? { token: localStorage.getItem("token"), id: localStorage.getItem("userId") } : null
  );
  const [error, setError] = useState<null | string>(null);
  const Navigate = useNavigate()
  const auth = useAuth();
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("لا يوجد توكن. يرجى تسجيل الدخول.");
        return;
      }
      // const response = await fetch("https://api.japaneseacademy.jp/allusers", {
      const response = await fetch(`${APIURL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("توكن غير صالح");
      const data = await response.json();
      // console.log(data, token)
      // const currentUser = data.find((u: any) => u.email === localStorage.getItem("userEmail"));
      if (data) {
        setUser(data);
        localStorage.setItem("userId", data.id); // تحديث التخزين
      } else {
        setError("اسم المستخدم أو كلمة المرور خطأ");
      }
    } catch (err: { message: string } | any) {
      setError(err?.message)
      console.error("Error:", err?.message);
      console.log(error)
    }
  };

  useEffect(() => {
    fetchUserData();
  
    setRole(auth.role)
  }, []);
  return (
    <>
      <nav className="navbar navbar-expand-xl navbar-light">
        <Link className="navbar-brand" to="/">
          <img src={Logo} alt="" />
        </Link>
        <div className="buttons_mobile">
          {!auth.user ? (
            <div className="buttons">
              <Link to="/Login_users">
                <button className="login_nav">
                  <span className="button-content">تسجيل الدخول</span>
                </button>
              </Link>
              <Link to="/Register_account">
                <button className="register_nav">
                  <span className="button-content">سجل الآن</span>
                </button>

              </Link>
            </div>
          ) : (
            // عرض معلومات المستخدم إذا كان مسجل الدخول
            <div className="user-info">
              <div className="user-info-buttons">
                <span className="user-icon">
                  {/* يمكنك إضافة أيقونة هنا */}
                </span>
                {role !== "teacher" && (
                    <Link to={`/Dash_users/${auth.user?.id}`}>
                    <button className="register_nav"><span className="button-content">لوحة التحكم</span></button>
                  </Link>
                )}
                {role === "teacher" && (
                  <Link to="/Dash_Teachers">
                    <button className="register_nav"><span className="button-content">لوحة التحكم</span></button>
                  </Link>
                )}
                <Link to="/">
                  <button
                    className="logout_nav register_nav"
                    onClick={() => {
                      localStorage.removeItem("auth");
                      localStorage.removeItem("token");
                      localStorage.removeItem("userEmail");
                      localStorage.removeItem("userId");
                      localStorage.removeItem("userRole");
                      localStorage.removeItem("firstName");
                      localStorage.removeItem("showVideoCall");
                      localStorage.removeItem("uid");
                      // sessionStorage.removeItem("auth");
                      auth.logout()
                      Navigate('/')
                      window.location.reload()
                    }}

                  >
                    <span className="button-content">تسجيل الخروج</span>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
        <button
          className={`custom-toggler ${isOpen ? "open" : ""}`}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="custom-toggler-icon"></span>
        </button>


        <div className={`collapse navbar-collapse ${isOpen ? "show animated-slide" : "animated-hide"}`}
          id="navbarNavDropdown">
          <div className="buttons_pc">
            {!auth.user ? (
              <div className="buttons">
                <Link to="/Register_account">
                  <button className="register_nav">
                    <span className="button-content">سجل الآن</span>
                  </button>
                </Link>
                <Link to="/Login_users">
                  <button className="login_nav">
                    <span className="button-content">تسجيل الدخول</span>
                  </button>
                </Link>
              </div>
            ) : (
              // عرض معلومات المستخدم إذا كان مسجل الدخول
              <div className="user-info">
                <span className="user-icon">
                  {/* يمكنك إضافة أيقونة هنا */}
                </span>
                {role !== "teacher" && (
                  <Link to={`/Dash_users/${auth.user?.id}`}>
                    <button className="register_nav"><span className="button-content">لوحة التحكم</span></button>
                  </Link>
                )}
                {role === "teacher" && (
                  <Link to="/Dash_Teachers">
                    <button className="register_nav"><span className="button-content">لوحة التحكم</span></button>
                  </Link>
                )}
                <Link to="/">
                  <button
                    className="logout_nav register_nav"
                    onClick={() => {
                      localStorage.removeItem("auth");
                      localStorage.removeItem("token");
                      localStorage.removeItem("userEmail");
                      localStorage.removeItem("userId");
                      localStorage.removeItem("userRole");
                      localStorage.removeItem("firstName");
                      localStorage.removeItem("showVideoCall");
                      localStorage.removeItem("uid");
                      sessionStorage.removeItem("auth");
                      Navigate('/')
                      window.location.reload()
                    }}
                  >
                    <span className="button-content">تسجيل الخروج</span>

                  </button>
                </Link>
              </div>
            )}
          </div>
          <ul className="navbar-nav">
            <div className="group">
              <div className="group_1">
                <li className="nav-item active ">
                  <Link className="nav-a" to="/">
                    <FaHome />
                    الصفحة الرئيسية
                    <span className="sr-only"></span>
                  </Link>
                </li>
                {/* <li className="nav-item item2 hidden">
              <a className="nav-a" href="/academy/about">
                <IoPerson /> من نحن ؟
              </a>
            </li> */}
                {/* <li className="nav-item item3 hidden">
              <a className="nav-a" href="/academy/Date">
                <GrServices /> محتويات الدروس
                </a>
                </li> */}
                <li className="nav-item ">
                  <Link className="nav-a dropdown-item" to="/Teachers">
                    <FaUserGroup />
                    الهيئة التدريسية
                  </Link>
                </li>

                <li className="nav-item  ">
                  <Link className="nav-a" to="/Level_division">
                    <MdLibraryBooks />
                    المستويات الدراسية
                  </Link>
                </li>

                <li className="nav-item  ">
                  <Link className="nav-a dropdown-item" to="/Study_materials">
                    <FaBook />
                    المواد الدراسية
                  </Link>
                </li>

                {/* <li className="nav-item item4 hidden">
              <Link className="nav-a dropdown-item" to="/Register">
              <FaCashRegister />
              طريقة التسجيل
              </Link>
              </li>
              */}
              </div>
              <div className="group_2">
                <li className="nav-item  ">
                  <Link className="nav-a" to="/Fees">
                    <BsCashCoin />
                    الرسوم الدراسية
                  </Link>
                </li>

                <li className="nav-item  ">
                  <Link className="nav-a dropdown-item" to="/Questions">
                    <FaQuestionCircle />
                    الأسئلة الشائعة
                  </Link>
                </li>

                <li className="nav-item  ">
                  <Link className="nav-a dropdown-item" to="/Comments">
                    <FaCommentAlt />
                    آراء الطلاب
                  </Link>
                </li>
                <li className="nav-item  ">
                  <Link className="nav-a dropdown-item" to="/More_services">
                    <GrMoreVertical />
                    خدمات إضافية
                  </Link>
                </li>
                <li className="nav-item  ">
                  <Link className="nav-a dropdown-item" to="/Support">
                    <FaMicrophoneLines />
                    الدعم الفني
                  </Link>
                </li>

                {/* <li>
              <Link className="nav-a dropdown-item" to="/Login">
              <FaCashRegister />
              لوحة التحكم
              </Link>
              </li> */}
              </div>
              <div className="group_3">

                {/* <li className="nav-item item4 hidden">
              <Link className="nav-a dropdown-item" to="/Privacy">
              <MdPrivacyTip />
              سياسة الخصوصية
              </Link>
            </li>
          <li className="nav-item item4 hidden">
              <Link className="nav-a dropdown-item" to="/Terms"> 
              <FaHandshake />
              شروط الاستخدام
              </Link>
            </li> */}
              </div>
            </div>
            {/* <li className="nav-item dropdown">
              <a
              className="nav-a dropdown-toggle"
                href="#"
                id="navbarDropdownMenua"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <HiChevronDoubleDown /> باقي الأقسام
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenua"
              >
                <div className="nav-item item4 hidden">
                  <a
                    className="nav-a dropdown-item"
                    href="/Study_materials"
                  >
                    المواد الدراسية
                  </a>
                </div>
                <div className="nav-item item4 hidden">
                  <a className="nav-a dropdown-item" href="/Teachers">
                    التعريف بالأساتذة
                  </a>
                </div>
                <div className="nav-item item4 hidden">
                  <a className="nav-a dropdown-item" href="/More_services">
                    خدمات إاضافية
                  </a>
                  <a className="nav-a dropdown-item" href="/Login">
                    لوحة التحكم
                  </a>
                </div>
                <div className="nav-item item4 hidden">
                  <a className="nav-a dropdown-item" href="/Support">
                    الدعم الفني
                  </a>
                </div>
              </div>
            </li> */}
          </ul>
        </div>
      </nav>
    </>
  );
}
