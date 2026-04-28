import './App.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from './router/AppRouter';
import { Cookies } from './components';
import { FaArrowAltCircleUp, FaLine, FaWhatsapp } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import Logo from "../src/assets/Logo/الشعار-2-png.png";
import { Suspense } from "react";
const queryClient = new QueryClient();

function App() {
  const [hideSocial, setHideSocial] = useState(false);
  // const [loading, setLoading] = useState(true); // اجعل البداية true

  const [showIcons, setShowIcons] = useState(false);

  const toggleIcons = () => {
    setShowIcons(!showIcons);
  };

  useEffect(() => {
    const up = document.querySelectorAll(".up");

    const handleScroll = () => {
      window.scrollY >= 120
        ? up.forEach((item) => item.classList.add("look"))
        : up.forEach((item) => item.classList.remove("look"));
    };

    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    window.addEventListener("scroll", handleScroll);
    up.forEach((item) => item.addEventListener("click", handleScrollToTop));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      up.forEach((item) =>
        item.removeEventListener("click", handleScrollToTop)
      );
    };
  }, []);

  useEffect(() => {
    setInterval(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      });

      const Elements = document.querySelectorAll(
        ".left ,.right ,.top ,.hidden"
      );
      Elements.forEach((el) => observer.observe(el));

      return () => {
        Elements.forEach((el) => observer.unobserve(el));
      };
    });
  }, []);
  useEffect(() => {
    // التحقق من حالة العنصر في localStorage
    const hide = localStorage.getItem("hideSocial");
    if (hide === "true") {
      setHideSocial(true);
    }

    return () => {
      // إعادة الوضع الطبيعي عندما يغادر المستخدم الصفحة
      setHideSocial(false);
    };
  }, []);

  useEffect(() => {
    const loadResources = async () => {
      await document.fonts.ready; // انتظر تحميل الخطوط
      setTimeout(() => {
        // setLoading(false);
      }, 500); // تأخير بسيط لإعطاء إحساس بالسلاسة
    };

    loadResources();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Cookies />
      <button className="up">
        <FaArrowAltCircleUp />
      </button>

      <div className={`social ${hideSocial ? "noneSocial" : ""}`}>
        <ul onClick={toggleIcons} style={{ cursor: "pointer" }}>
          <li className="click">
            <IoChatbubbleEllipsesOutline />
          </li>
          {showIcons && (
            <>
              <li className="line top">
                <a href="https://line.me/ti/p/IuAqVt59QV">
                  <FaLine />
                </a>
              </li>
              <li className="email top">
                <a href="mailto:contact@sawagroup.jp">
                  <MdEmail />
                </a>
              </li>
              <li className="whatsapp top">
                <a href="https://wa.link/mr0gya">
                  <FaWhatsapp />
                </a>
              </li>
              
            </>
          )}
        </ul>
      </div>
      <Suspense fallback={<img className="Loading" src={Logo} alt="" />}>
        <AppRouter />
      </Suspense>
    </QueryClientProvider>
  );
}


export default App
