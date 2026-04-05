import { useState, useEffect, useRef } from "react";
import "./Register_account.css";
import { useNavigate, Link } from "react-router-dom";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import Register_header from "../Register_header/Register_header";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import APIURL from "../../api/constants";
import { toast } from "react-toastify";
export default function Register_account() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    age: "",
    gender: "",
    dial: "",
    educationLevel: "",
    japaneseLevel: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationField, setShowVerificationField] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [direction, setDirection] = useState("ltr");

  const ageSelectRef = useRef(null);
  const countrySelectRef = useRef(null);
  const countrySelectDialRef = useRef(null);
  const genderSelectRef = useRef(null);
  const educationSelectRef = useRef(null);
  const japaneseLevelSelectRef = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryDial, setSelectedCountryDial] = useState("");
  const [errorCountry, setErrorCountry] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    const ageChoices = new Choices(ageSelectRef.current!, {
      searchEnabled: true,
      removeItemButton: true,
    });

    const countryChoices = new Choices(countrySelectRef.current!, {
      searchEnabled: true,
      removeItemButton: true,
    });

    const countryDialChoices = new Choices(countrySelectDialRef.current!, {
      searchEnabled: true,
      removeItemButton: true,
    });

    const genderChoices = new Choices(genderSelectRef.current!, {
      searchEnabled: false,
      removeItemButton: true,
    });

    const educationChoices = new Choices(educationSelectRef.current!, {
      searchEnabled: false,
      removeItemButton: true,
    });

    const japaneseLevelChoices = new Choices(japaneseLevelSelectRef.current!, {
      searchEnabled: false,
      removeItemButton: true,
    });

    return () => {
      ageChoices.destroy();
      genderChoices.destroy();
      educationChoices.destroy();
      japaneseLevelChoices.destroy();
      countryChoices.destroy();
      countryDialChoices.destroy();
    };
  }, []);

  useEffect(() => {
    const lang = navigator.language || navigator.language;
    const isArabic = lang.startsWith("ar");

    const selectElement = document.querySelector("select");
    if (selectElement) {
      selectElement.style.direction = isArabic ? "rtl" : "ltr";
      selectElement.style.textAlign = isArabic ? "right" : "left";
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*~\-_.]/.test(password),
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // التحقق من وجود الحروف العربية
    if (/[\u0600-\u06FF]/.test(value)) {
      setDirection("rtl"); // الكتابة من اليمين لليسار
      console.log(direction)
    } else {
      setDirection("ltr"); // الكتابة من اليسار لليمين
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = {
      first_name: formData.firstName,
      age: Number(formData.age),
      password_confirmation: formData.confirmPassword,
      country: formData.country,
      phone: formData.dial + formData.phone,
      education_level: formData.educationLevel,
      gender: formData.gender,
      email: formData.email,
      password: formData.password,
      japanese_level: formData.japaneseLevel,
      last_name: formData.lastName,
    }
    console.log("بيانات الإرسال:", form);

    // التحقق من تطابق البريد الإلكتروني وتأكيده
    if (formData.email !== confirmEmail) {
      setErrorEmail("يجب أن يكون البريد الإلكتروني صحيحًا ومتطابقًا.");
      return;
    }

    if (!selectedCountry) {
      setErrorCountry(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.warning("كلمات السر غير متطابقة");
      return;
    }

    if (!Object.values(passwordCriteria).every(Boolean)) {
      setPasswordError(
        "يجب أن تحتوي كلمة السر على ٨ أحرف على الأقل، حرف كبير واحد، حرف صغير واحد، رقم واحد، ورمز خاص."
      );
      return;
    } else {
      setPasswordError("");
    }

    setIsRegistering(true);

    try {
      // const response = await fetch("https://api.japaneseacademy.jp/register", {
      const response = await fetch(`${APIURL}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error)
        toast.error(`حدث خطأ: ${data.error}`);
      } else {
        toast.success("تم التسجيل بنجاح، تحقق من بريدك الإلكتروني لتفعيل الحساب");
        setShowVerificationField(true);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    // fetch("https://api.japaneseacademy.jp/verify", {
    fetch(`${APIURL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.email, otp: verificationCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error("رمز التحقق غير صحيح");
        } else {
          toast.success("تم التحقق من البريد الإلكتروني بنجاح");
          navigate("/Login_users/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  };
  const handleResetVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // setIsVerifying(true);

    // fetch("https://api.japaneseacademy.jp/verify", {
    fetch(`${APIURL}/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error("حصل خطاً");
        } else {
          toast.success("تم إعادة إرسال كود التحقق");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        // setIsVerifying(false);
      });
  };

  const handlePaste = (e: any) => {
    e.preventDefault(); // منع اللصق
    toast.warning("لا يُسمح بلصق النص هنا.");
  };

  const [passwordVisible, setPasswordVisible] = useState(false); // حالة لرؤية كلمة المرور
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // حالة لرؤية تأكيد كلمة المرور

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const countries = [
    { code: "DZ", name: "الجزائر", dial: "+213", flag: "https://flagcdn.com/w40/dz.png" },
    { code: "BH", name: "البحرين", dial: "+973", flag: "https://flagcdn.com/w40/bh.png" },
    { code: "KM", name: "جزر القمر", dial: "+269", flag: "https://flagcdn.com/w40/km.png" },
    { code: "DJ", name: "جيبوتي", dial: "+253", flag: "https://flagcdn.com/w40/dj.png" },
    { code: "EG", name: "مصر", dial: "+20", flag: "https://flagcdn.com/w40/eg.png" },
    { code: "IQ", name: "العراق", dial: "+964", flag: "https://flagcdn.com/w40/iq.png" },
    { code: "JO", name: "الأردن", dial: "+962", flag: "https://flagcdn.com/w40/jo.png" },
    { code: "KW", name: "الكويت", dial: "+965", flag: "https://flagcdn.com/w40/kw.png" },
    { code: "LB", name: "لبنان", dial: "+961", flag: "https://flagcdn.com/w40/lb.png" },
    { code: "LY", name: "ليبيا", dial: "+218", flag: "https://flagcdn.com/w40/ly.png" },
    { code: "MR", name: "موريتانيا", dial: "+222", flag: "https://flagcdn.com/w40/mr.png" },
    { code: "MA", name: "المغرب", dial: "+212", flag: "https://flagcdn.com/w40/ma.png" },
    { code: "OM", name: "عمان", dial: "+968", flag: "https://flagcdn.com/w40/om.png" },
    { code: "PS", name: "فلسطين", dial: "+970", flag: "https://flagcdn.com/w40/ps.png" },
    { code: "QA", name: "قطر", dial: "+974", flag: "https://flagcdn.com/w40/qa.png" },
    { code: "SA", name: "السعودية", dial: "+966", flag: "https://flagcdn.com/w40/sa.png" },
    { code: "SO", name: "الصومال", dial: "+252", flag: "https://flagcdn.com/w40/so.png" },
    { code: "SD", name: "السودان", dial: "+249", flag: "https://flagcdn.com/w40/sd.png" },
    { code: "SY", name: "سوريا", dial: "+963", flag: "https://flagcdn.com/w40/sy.png" },
    { code: "TN", name: "تونس", dial: "+216", flag: "https://flagcdn.com/w40/tn.png" },
    { code: "AE", name: "الإمارات", dial: "+971", flag: "https://flagcdn.com/w40/ae.png" },
    { code: "YE", name: "اليمن", dial: "+967", flag: "https://flagcdn.com/w40/ye.png" },

    { code: "AF", name: "أفغانستان", dial: "+93", flag: "https://flagcdn.com/w40/af.png" },
    { code: "AL", name: "ألبانيا", dial: "+355", flag: "https://flagcdn.com/w40/al.png" },
    { code: "AS", name: "ساموا الأمريكية", dial: "+1684", flag: "https://flagcdn.com/w40/as.png" },
    { code: "AD", name: "أندورا", dial: "+376", flag: "https://flagcdn.com/w40/ad.png" },
    { code: "AO", name: "أنغولا", dial: "+244", flag: "https://flagcdn.com/w40/ao.png" },
    { code: "AG", name: "أنتيغوا وباربودا", dial: "+1268", flag: "https://flagcdn.com/w40/ag.png" },
    { code: "AR", name: "الأرجنتين", dial: "+54", flag: "https://flagcdn.com/w40/ar.png" },
    { code: "AM", name: "أرمينيا", dial: "+374", flag: "https://flagcdn.com/w40/am.png" },
    { code: "AU", name: "أستراليا", dial: "+61", flag: "https://flagcdn.com/w40/au.png" },
    { code: "AT", name: "النمسا", dial: "+43", flag: "https://flagcdn.com/w40/at.png" },
    { code: "AZ", name: "أذربيجان", dial: "+994", flag: "https://flagcdn.com/w40/az.png" },
    { code: "BS", name: "الباهاما", dial: "+1242", flag: "https://flagcdn.com/w40/bs.png" },
    { code: "BD", name: "بنغلاديش", dial: "+880", flag: "https://flagcdn.com/w40/bd.png" },
    { code: "BB", name: "بربادوس", dial: "+1246", flag: "https://flagcdn.com/w40/bb.png" },
    { code: "BY", name: "بيلاروس", dial: "+375", flag: "https://flagcdn.com/w40/by.png" },
    { code: "BE", name: "بلجيكا", dial: "+32", flag: "https://flagcdn.com/w40/be.png" },
    { code: "BZ", name: "بليز", dial: "+501", flag: "https://flagcdn.com/w40/bz.png" },
    { code: "BJ", name: "بنين", dial: "+229", flag: "https://flagcdn.com/w40/bj.png" },
    { code: "BT", name: "بوتان", dial: "+975", flag: "https://flagcdn.com/w40/bt.png" },
    { code: "BO", name: "بوليفيا", dial: "+591", flag: "https://flagcdn.com/w40/bo.png" },
    { code: "BA", name: "البوسنة والهرسك", dial: "+387", flag: "https://flagcdn.com/w40/ba.png" },
    { code: "BW", name: "بوتسوانا", dial: "+267", flag: "https://flagcdn.com/w40/bw.png" },
    { code: "BR", name: "البرازيل", dial: "+55", flag: "https://flagcdn.com/w40/br.png" },
    { code: "BN", name: "بروناي", dial: "+673", flag: "https://flagcdn.com/w40/bn.png" },
    { code: "BG", name: "بلغاريا", dial: "+359", flag: "https://flagcdn.com/w40/bg.png" },
    { code: "BF", name: "بوركينا فاسو", dial: "+226", flag: "https://flagcdn.com/w40/bf.png" },
    { code: "BI", name: "بوروندي", dial: "+257", flag: "https://flagcdn.com/w40/bi.png" },
    { code: "CV", name: "الرأس الأخضر", dial: "+238", flag: "https://flagcdn.com/w40/cv.png" },
    { code: "KH", name: "كمبوديا", dial: "+855", flag: "https://flagcdn.com/w40/kh.png" },
    { code: "CM", name: "الكاميرون", dial: "+237", flag: "https://flagcdn.com/w40/cm.png" },
    { code: "CA", name: "كندا", dial: "+1", flag: "https://flagcdn.com/w40/ca.png" },
    { code: "CF", name: "جمهورية أفريقيا الوسطى", dial: "+236", flag: "https://flagcdn.com/w40/cf.png" },
    { code: "TD", name: "تشاد", dial: "+235", flag: "https://flagcdn.com/w40/td.png" },
    { code: "CL", name: "تشيلي", dial: "+56", flag: "https://flagcdn.com/w40/cl.png" },
    { code: "CN", name: "الصين", dial: "+86", flag: "https://flagcdn.com/w40/cn.png" },
    { code: "CO", name: "كولومبيا", dial: "+57", flag: "https://flagcdn.com/w40/co.png" },
    { code: "CG", name: "الكونغو", dial: "+242", flag: "https://flagcdn.com/w40/cg.png" },
    { code: "CD", name: "الكونغو الديمقراطية", dial: "+243", flag: "https://flagcdn.com/w40/cd.png" },
  ];

  const handleCountryChange = (countryCode: string) => {
    const countryName =
      countries.find((c) => c.code === countryCode)?.name || "";
    setSelectedCountry(countryName);
    setErrorCountry(false);
    setFormData((prev) => ({ ...prev, country: countryName }));
  };
  const handleCountryDial = (countryDial: string) => {
    const country = countries.find((c) => c.dial === countryDial);
    if (country) {
      setSelectedCountryDial(country.dial);
      console.log(selectedCountryDial)
      setErrorCountry(false);
      setFormData((prev) => ({ ...prev, dial: country.dial }));
    }
  };
  return (
    <div className="rg mb-5 mt-3">
      <div className="row RegisteR">
        <div className="register_half col-lg-6">
          <Register_header />
        </div>

        <div className="col-lg-6">
          {!showVerificationField && <form
            className="form-container academy p-5 m-auto"
            onSubmit={handleSubmit}
          >
            <h1 className="fw-bold m-auto mb-4 mt-4">إنشاء حساب</h1>

            <div>
              <label>
                <span style={{ color: "red" }}>*</span> الاسم الشخصي:
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={(e) => {
                  handleChange(e); // استدعاء الدالة الأولى
                  handleInputChange(e); // استدعاء الدالة الثانية
                }}
                style={{ direction: "rtl" }}
              />
            </div>

            <div>
              <label>
                <span style={{ color: "red" }}>*</span> اسم العائلة:
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={(e) => {
                  handleChange(e); // استدعاء الدالة الأولى
                  handleInputChange(e); // استدعاء الدالة الثانية
                }}
                style={{ direction: "rtl" }}
              />
            </div>


            <div>
              <label>
                <span style={{ color: "red" }}>*</span> دولة الإقامة:
              </label>
              <select
                dir="rtl"
                ref={countrySelectRef}
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="country-select"
              >
                <option value="" disabled>
                  اختر دولة
                </option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {/* <img src={country.flag} alt={country.name} className="img-fluid" style={{ width: "50px", height: "30px" }} /> */}

                    {country.name}
                  </option>
                ))}
              </select>
              {errorCountry && (
                <span style={{ color: "red", fontSize: "16px" }}>
                  يرجى اختيار دولة.
                </span>
              )}
            </div>
            <div>
              <label>
                <span style={{ color: "red" }}>*</span> العمر:
              </label>
              <select
                dir="rtl"
                ref={ageSelectRef}
                name="age"
                required
                onChange={handleChange}
              >
                <option value="">اختر العمر</option>
                {Array.from({ length: 100 }, (_, i) => i + 1).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>
                <span style={{ color: "red" }}>*</span> الجنس:
              </label>
              <select
                dir="rtl"
                ref={genderSelectRef}
                name="gender"
                required
                onChange={handleChange}
              >
                <option value="">اختر الجنس</option>
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>

            <div>
              <label>
                <span style={{ color: "red" }}>*</span> المستوى التعليمي:
              </label>
              <select
                dir="rtl"
                ref={educationSelectRef}
                name="educationLevel"
                required
                onChange={handleChange}
              >
                <option value="">اختر المستوى التعليمي</option>
                <option value="المرحلة الابتدائية">المرحلة الابتدائية</option>
                <option value="المرحلة الإعدادية">المرحلة الإعدادية</option>
                <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                <option value="مرحلة التعليم الجامعي">
                  مرحلة التعليم الجامعي
                </option>
                <option value="مرحلة المعاهد المتوسطة">
                  مرحلة المعاهد المتوسطة
                </option>
                <option value="مرحلة الدراسات العليا (ماجستير)">
                  مرحلة الدراسات العليا (ماجستير)
                </option>
                <option value="مرحلة الدراسات العليا (دكتوراه)">
                  مرحلة الدراسات العليا (دكتوراه)
                </option>
              </select>
            </div>

            <div>
              <label>
                <span style={{ color: "red" }}>*</span> مستوى اللغة اليابانية:
              </label>
              <select
                dir="rtl"
                ref={japaneseLevelSelectRef}
                name="japaneseLevel"
                required
                onChange={handleChange}
              >
                <option value="">اختر مستوى اللغة اليابانية</option>
                {Array.from({ length: 16 }, (_, index) => `J${index + 1}`).map(
                  (value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  )
                )}
              </select>
              <h5 className="japaneseLevelLink">
                يُرجى الضغط <Link to="/Level_division">هنا</Link> للاطلاع على
                تفاصيل المستويات الدراسية.
              </h5>
            </div>

            <div>
              <label>رقم الهاتف:</label>
              <div className="d-flex gap-2">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ direction: "rtl" }}
                />
                <div>
                  <select
                    dir="rtl"
                    ref={countrySelectDialRef}
                    value={selectedCountry}
                    onChange={(e) => handleCountryDial(e.target.value)}
                    className="country-select"
                  >
                    <option value="" disabled>
                      رمز الدولة
                    </option>

                    {countries.map((country) => (
                      <option
                        key={country.dial}
                        value={country.dial}
                        style={{ direction: "ltr" }}
                      >

                        {country.name}  {"  "}    <span>
                          {"\u200E"}{country.dial}
                        </span>
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label>
                <span style={{ color: "red" }}>*</span> البريد الإلكتروني:
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email} // استخدام formData.email بدلاً من confirmEmail
                onChange={handleChange}
                style={{ direction: "ltr" }}
              />

              {errorEmail && (
                <span
                  style={{ direction: "ltr", color: "red", fontSize: "16px" }}
                >
                  {error}
                </span>
              )}
            </div>

            <div>
              <label>
                <span style={{ color: "red" }}>*</span> تأكيد البريد الإلكتروني:
              </label>
              <input
                type="email"
                required
                value={confirmEmail}
                onPaste={handlePaste}
                onChange={(e) => setConfirmEmail(e.target.value)}
                style={{ direction: "ltr" }}
              />
              {errorEmail && (
                <span
                  style={{ direction: "ltr", color: "red", fontSize: "16px" }}
                >
                  {error}
                </span>
              )}
            </div>

            <div>
              <div>
                <label>
                  <span style={{ color: "red" }}>*</span> كلمة السر:
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      handleChange(e); // استدعاء الدالة الأولى
                      handleInputChange(e); // استدعاء الدالة الثانية
                    }}
                    onPaste={handlePaste} // منع اللصق
                    style={{ direction: "ltr", paddingRight: "30px" }}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      cursor: "pointer",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <IoEyeSharp />}{" "}
                    {/* رموز العين */}
                  </span>
                </div>
                {passwordError && (
                  <p style={{ color: "red" }}>{passwordError}</p>
                )}
                <ul className="password">
                  <li
                    style={{ color: passwordCriteria.length ? "green" : "red" }}
                  >
                    {passwordCriteria.length
                      ? "-  تحتوي على 8 أحرف على الأقل."
                      : "- يجب أن تحتوي على 8 أحرف على الأقل."}
                  </li>
                  <li
                    style={{
                      color: passwordCriteria.uppercase ? "green" : "red",
                    }}
                  >
                    {passwordCriteria.uppercase
                      ? "-  تحتوي على حرف كبير واحد على الأقل."
                      : "- يجب أن تحتوي على حرف كبير واحد على الأقل."}
                  </li>
                  <li
                    style={{
                      color: passwordCriteria.lowercase ? "green" : "red",
                    }}
                  >
                    {passwordCriteria.lowercase
                      ? "-  تحتوي على حرف صغير واحد على الأقل."
                      : "- يجب أن تحتوي على حرف صغير واحد على الأقل."}
                  </li>
                  <li
                    style={{ color: passwordCriteria.number ? "green" : "red" }}
                  >
                    {passwordCriteria.number
                      ? "-  تحتوي على رقم واحد على الأقل."
                      : "- يجب أن تحتوي على رقم واحد على الأقل."}
                  </li>
                  <li
                    style={{
                      color: passwordCriteria.specialChar ? "green" : "red",
                    }}
                  >
                    {passwordCriteria.specialChar
                      ? "- تحتوي على رمز واحد على الأقل (!@#$%^&*~-_.)."
                      : "- يجب أن تحتوي على رمز واحد على الأقل (!@#$%^&*~-_.)."}
                  </li>
                </ul>
              </div>

              <div>
                <label>
                  <span style={{ color: "red" }}>*</span> تأكيد كلمة السر:
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      handleChange(e); // استدعاء الدالة الأولى
                      handleInputChange(e); // استدعاء الدالة الثانية
                    }}
                    onPaste={handlePaste} // منع اللصق
                    style={{ direction: "ltr", paddingRight: "30px" }}
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      cursor: "pointer",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <IoEyeSharp />}{" "}
                    {/* رموز العين */}
                  </span>
                </div>
              </div>
            </div>
            <button className="mt-4" type="submit" disabled={isRegistering}>
              {isRegistering ? "جاري التسجيل..." : "سجل الآن"}
            </button>
          </form>}

          {showVerificationField && (
            <form
              className="form-container academy mt-3"
              onSubmit={handleVerification}
            >
              <label className="fs-5">أدخل كود التحقق:</label>
              <input
                type="text"
                placeholder="أدخل كود التحقق"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  handleInputChange(e);
                }}
              />
              <button
                className="mt-4 mb-5"
                type="submit"
                disabled={isVerifying}
              >
                {isVerifying ? "جاري التحقق..." : "تحقق"}
              </button>
              <div
                onClick={handleResetVerification}
                style={{ direction: "rtl", color: "red", fontSize: "23px", textAlign: "center", cursor: "pointer" }}
              >
                إعادة إرسال كود التحقق
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
