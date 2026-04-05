import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Dash_user.css'
import APIURL from "../../api/constants";
import type { TUserData } from "../../types/user";
function Dash_user() {
  const [userData, setUserData] = useState<TUserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${APIURL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // إرسال التوكن في العنوان
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setUserData(data); // تخزين بيانات المستخدم في الحالة
        } else {
          console.log("error")
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/Login_users");
      });
  }, [navigate]);

  if (!userData) {
    // إظهار رسالة تحميل حتى يتم جلب البيانات
    return <p>جارٍ تحميل البيانات...</p>;
  }

  return (
    <div className="dashboard container mt-5 mb-5 academy">
      <h3 className="fw-bold">مرحباً، {userData && <> <span>{userData.first_name} </span> <span>{userData.last_name}</span></>}</h3>
      <p>البريد الإلكتروني: {userData && <span>{userData.email} </span>}</p>
      <p>الدولة: {userData && <span>{userData.country} </span>}</p>
      <p>العمر:{userData && <span> {userData.age} </span>}</p>
      <p>الجنس: {userData && <span>{userData.gender} </span>}</p>
      <p>المستوى التعليمي: {userData && <span>{userData.education_level} </span>}</p>
      <p>مستوى اللغة اليابانية: {userData && <span>{userData.japanese_level} </span>}</p>
      <p>رقم الهاتف: {userData && <span>{userData.phone} </span>}</p>
    </div>
  );
}

export default Dash_user;
