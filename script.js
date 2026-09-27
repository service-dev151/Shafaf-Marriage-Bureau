/**
 * Shafaf Marriage Bureau - Interactive Client Logic
 * Founder: Mian Sajid | 18 Years Experience
 * Single-Page Application (Vanilla JavaScript)
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHeroCarousel();
  initCounters();
  initScrollReveal();
  initPricingPortal();
  initPaymentModal();
  initProfileForm();
  initGalleryLightbox();
  initBackToTop();
  initImageFallbacks();
});

/* ==========================================================================
   1. NAVBAR & MOBILE NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector(".site-header");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  const mobileBackdrop = document.getElementById("mobileBackdrop");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  // Sticky header background on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
    highlightCurrentSection();
  }, { passive: true });

  // Mobile drawer toggle
  function toggleMobileMenu(open) {
    const isOpen = open !== undefined ? open : !mobileNav?.classList.contains("open");
    if (isOpen) {
      mobileNav?.classList.add("open");
      mobileBackdrop?.classList.add("open");
      hamburgerBtn?.classList.add("open");
      hamburgerBtn?.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    } else {
      mobileNav?.classList.remove("open");
      mobileBackdrop?.classList.remove("open");
      hamburgerBtn?.classList.remove("open");
      hamburgerBtn?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  }

  hamburgerBtn?.addEventListener("click", () => toggleMobileMenu());
  mobileBackdrop?.addEventListener("click", () => toggleMobileMenu(false));

  // Close mobile menu on clicking any navigation link
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          toggleMobileMenu(false);
          const fixedHeader = document.getElementById("headerFixedGroup") || header;
          const headerHeight = fixedHeader ? fixedHeader.offsetHeight : 110;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });

  // Highlight active link while scrolling
  function highlightCurrentSection() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. HERO SECTION CAROUSEL
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.getElementById("heroPrevBtn");
  const nextBtn = document.getElementById("heroNextBtn");
  const carouselContainer = document.querySelector(".hero-section");

  if (!slides.length) return;

  let currentSlide = 0;
  let carouselTimer = null;
  const slideInterval = 5000;

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
      dot.setAttribute("aria-current", i === currentSlide ? "true" : "false");
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    carouselTimer = setInterval(nextSlide, slideInterval);
  }

  function stopAutoPlay() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    startAutoPlay();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    startAutoPlay();
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      showSlide(idx);
      startAutoPlay();
    });
  });

  // Pause on hover
  carouselContainer?.addEventListener("mouseenter", stopAutoPlay);
  carouselContainer?.addEventListener("mouseleave", startAutoPlay);

  // Touch Swipe for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  carouselContainer?.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselContainer?.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 45;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      startAutoPlay();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      startAutoPlay();
    }
  }

  startAutoPlay();
}

/* ==========================================================================
   3. ANIMATED STATISTICS COUNTERS
   ========================================================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach((counter) => {
          const target = parseInt(counter.getAttribute("data-target"), 10) || 0;
          animateValue(counter, 0, target, 2000);
        });
      }
    });
  }, { threshold: 0.35 });

  const statsSection = document.getElementById("stats") || document.getElementById("why-us");
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easedProgress * (end - start) + start);
      obj.textContent = currentVal;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll(".fade-up-element");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. RISHTA PROFILE FORM & URDU WHATSAPP GENERATION
   ========================================================================== */
function initProfileForm() {
  const form = document.getElementById("rishtaProfileForm");
  const previewBox = document.getElementById("urduPreviewContent");
  const whatsappNumber = "923006726233"; // 0300 6726233 formatted for wa.me

  if (!form) return;

  const genderUrduMap = {
    male: "مرد",
    female: "خاتون",
    man: "مرد",
    woman: "خاتون",
    boy: "لڑکا",
    girl: "لڑکی",
    widow: "بیوہ",
    widower: "رنڈوا",
    divorced: "طلاق یافتہ",
    never_married: "غیر شادی شدہ",
    married: "شادی شدہ"
  };

  const maritalStatusUrduMap = {
    never_married: "غیر شادی شدہ",
    married: "شادی شدہ",
    divorced: "طلاق یافتہ",
    widow: "بیوہ",
    widower: "رنڈوا"
  };

  const generalUrduMap = {
    // Gender
    male: "مرد",
    female: "خاتون",
    man: "مرد",
    woman: "خاتون",
    boy: "لڑکا",
    girl: "لڑکی",

    // Marital status
    never_married: "غیر شادی شدہ",
    unmarried: "غیر شادی شدہ",
    single: "غیر شادی شدہ",
    married: "شادی شدہ",
    divorced: "طلاق یافتہ",
    widowed: "بیوہ",
    widow: "بیوہ",
    widower: "رنڈوا",

    // Education
    phd: "پی ایچ ڈی",
    master: "ماسٹرز",
    masters: "ماسٹرز",
    bachelor: "بیچلرز",
    bachelors: "بیچلرز",
    mbbs: "ایم بی بی ایس",
    bds: "بی ڈی ایس",
    mba: "ایم بی اے",
    llb: "ایل ایل بی",
    msc: "ماسٹرز",
    bsc: "بیچلرز",
    matric: "میٹرک",
    fsc: "ایف ایس سی",
    fa: "ایف اے",
    intermediate: "انٹرمیڈیٹ",
    graduate: "گریجویٹ",

    // Professions
    doctor: "ڈاکٹر",
    engineer: "انجینئر",
    businessman: "کاروباری شخصیت",
    business: "کاروبار",
    teacher: "استاد",
    professor: "پروفیسر",
    lawyer: "وکیل",
    advocate: "وکیل",
    accountant: "اکاؤنٹنٹ",
    banker: "بینکر",
    job: "ملازمت",
    student: "طالب علم",
    housewife: "گھریلو خاتون",
    army: "فوج",
    police: "پولیس",
    farmer: "کاشتکار",
    contractor: "کنٹریکٹر",

    // Complexion
    fair: "صاف",
    wheatish: "گندمی",
    dark: "سانولا",
    brown: "براؤن",
    white: "سفید",

    // Property
    acre: "ایکڑ",
    acres: "ایکڑ",
    shop: "دکان",
    shops: "دکانیں",
    car: "گاڑی",
    cars: "گاڑیاں",
    house: "گھر",
    plot: "پلاٹ",
    flat: "فلیٹ",
    apartment: "اپارٹمنٹ",

    // Siblings / family
    brother: "بھائی",
    brothers: "بھائی",
    sister: "بہن",
    sisters: "بہنیں",
    elder: "بڑے",
    older: "بڑے",
    younger: "چھوٹے",

    // Units & measurements
    year: "سال",
    years: "سال",
    feet: "فٹ",
    foot: "فٹ",
    ft: "فٹ",
    inch: "انچ",
    inches: "انچ",

    // Pakistani cities
    lahore: "لاہور",
    islamabad: "اسلام آباد",
    rawalpindi: "راولپنڈی",
    karachi: "کراچی",
    multan: "ملتان",
    faisalabad: "فیصل آباد",
    peshawar: "پشاور",
    quetta: "کوئٹہ",
    hyderabad: "حیدرآباد",
    gujranwala: "گجرانوالہ",
    sialkot: "سیالکوٹ",
    bahawalpur: "بہاولپور",
    sargodha: "سرگودھا",
    sukkur: "سکھر",

    // Common words
    no: "نہیں",
    yes: "ہاں",
    and: "اور",
    city: "شہر",
    one: "ایک",
    two: "دو",
    three: "تین",
    four: "چار",
    five: "پانچ",
    six: "چھ",
    seven: "سات",
    eight: "آٹھ",
    nine: "نو",
    ten: "دس",

    // Common names
    sajid: "ساجد",
    saim: "صائم",
    ali: "علی",
    ahmed: "احمد",
    ahmad: "احمد",
    muhammad: "محمد",
    hussain: "حسین",
    usman: "عثمان",
    khan: "خان",
    qamar: "قمر",
    bashir: "بشیر",
    akram: "اکرم",
    imran: "عمران",
    farhan: "فرہان",
    hamza: "حمزہ",
    bilal: "بلال",
    zain: "زین",
    rashid: "رشید",
    noor: "نور",
    tariq: "طارق",
    khalid: "خالد",
    faisal: "فیصل",
    shahid: "شاہد",
    salman: "سلمان",
    rizwan: "رضوان",
    mian: "میاں",
    rana: "رانا",
    malik: "ملک",
    ayesha: "عائشہ",
    fatima: "فاطمہ",
    khadija: "خدیجہ",
    maryam: "مریم",
    zainab: "زینب",
    sana: "ثناء",
    sara: "سارہ"
  };

  const latinToUrduFallback = {
    a: "ا",
    b: "ب",
    c: "س",
    d: "ڈ",
    e: "ی",
    f: "ف",
    g: "گ",
    h: "ح",
    i: "ی",
    j: "ج",
    k: "ک",
    l: "ل",
    m: "م",
    n: "ن",
    o: "و",
    p: "پ",
    q: "ق",
    r: "ر",
    s: "س",
    t: "ٹ",
    u: "یو",
    v: "وی",
    w: "و",
    x: "کس",
    y: "ی",
    z: "ز"
  };

  function normalizeUrduText(rawValue, context = "general") {
    if (rawValue === null || rawValue === undefined) return "—";

    let text = String(rawValue).trim();
    if (!text || text === "—") return "—";

    const lookupMap = context === "gender" ? genderUrduMap : context === "marital" ? maritalStatusUrduMap : generalUrduMap;

    // Sort keys by length descending so longer phrases replace before shorter words
    const sortedKeys = Object.keys(lookupMap).sort((a, b) => b.length - a.length);
    let converted = text;

    for (const key of sortedKeys) {
      const escaped = key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const pattern = new RegExp(`\\b${escaped}\\b`, "gi");
      converted = converted.replace(pattern, lookupMap[key]);
    }

    // For any remaining English words, transliterate character-by-character
    converted = converted.replace(/[a-zA-Z]+/g, (match) => {
      const ml = match.toLowerCase();
      if (lookupMap[ml]) return lookupMap[ml];
      if (generalUrduMap[ml]) return generalUrduMap[ml];
      return Array.from(ml).map((char) => latinToUrduFallback[char] || char).join("");
    });

    converted = converted.replace(/\s+/g, " ").trim();
    return converted || "—";
  }

  function ensureUrduOnlyMessage(message) {
    if (!message) return "—";
    if (/[A-Za-z]/.test(message)) {
      const fields = [
        form.profileType?.value,
        form.personName?.value,
        form.fatherName?.value,
        form.age?.value,
        form.height?.value,
        form.maritalStatus?.value,
        form.complexion?.value,
        form.qualification?.value,
        form.jobProfession?.value,
        form.agriLand?.value,
        form.otherProperty?.value,
        form.sect?.value,
        form.caste?.value,
        form.siblingsCount?.value,
        form.siblingDetails?.value,
        form.marriedSiblings?.value,
        form.unmarriedSiblings?.value,
        form.requirements?.value,
        form.additionalInfo?.value
      ];

      const fixed = fields.map((field) => normalizeUrduText(field, field === form.profileType?.value ? "gender" : field === form.maritalStatus?.value ? "marital" : "general"));
      const fieldsMap = new Map();
      fieldsMap.set("profileType", fixed[0]);
      fieldsMap.set("personName", fixed[1]);
      fieldsMap.set("fatherName", fixed[2]);
      fieldsMap.set("age", fixed[3]);
      fieldsMap.set("height", fixed[4]);
      fieldsMap.set("maritalStatus", fixed[5]);
      fieldsMap.set("complexion", fixed[6]);
      fieldsMap.set("qualification", fixed[7]);
      fieldsMap.set("jobProfession", fixed[8]);
      fieldsMap.set("agriLand", fixed[9]);
      fieldsMap.set("otherProperty", fixed[10]);
      fieldsMap.set("sect", fixed[11]);
      fieldsMap.set("caste", fixed[12]);
      fieldsMap.set("siblingsCount", fixed[13]);
      fieldsMap.set("siblingDetails", fixed[14]);
      fieldsMap.set("marriedSiblings", fixed[15]);
      fieldsMap.set("unmarriedSiblings", fixed[16]);
      fieldsMap.set("requirements", fixed[17]);
      fieldsMap.set("additionalInfo", fixed[18]);

      const rebuiltMessage = `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
✨ رشتہ پروفائل - شفاف میرج بیورو ✨
سرپرست: محترم میاں ساجد (18 سالہ قابلِ اعتماد خاندانی خدمات)
فون و واٹس ایپ: 0300 6726233
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 بنیادی معلومات:
• پروفائل برائے: ${fieldsMap.get("profileType") || "—"}
• نام: ${fieldsMap.get("personName") || "—"}
• والد کا نام: ${fieldsMap.get("fatherName") || "—"}
• عمر: ${fieldsMap.get("age") ? `${fieldsMap.get("age")} سال` : "—"}
• قد: ${fieldsMap.get("height") || "—"}
• ازدواجی حیثیت: ${fieldsMap.get("maritalStatus") || "—"}
• بچے: ${form.hasChildren?.value === "yes" ? (form.childrenCount?.value?.trim() ? `${normalizeUrduText(form.childrenCount.value, "general")} بچے` : "ہاں") : "کوئی بچہ نہیں"}
• رنگت: ${fieldsMap.get("complexion") || "درج نہیں"}

🎓 تعلیم اور پیشہ ورانہ تفصیلات:
• تعلیم: ${fieldsMap.get("qualification") || "—"}
• ملازمت / کاروبار: ${fieldsMap.get("jobProfession") || "—"}

🏡 جائیداد و اثاثہ جات:
• زرعی زمین: ${fieldsMap.get("agriLand") || "درج نہیں"}
• دیگر جائیداد و رہائش: ${fieldsMap.get("otherProperty") || "درج نہیں"}

🕌 خاندانی و سماجی پس منظر:
• مسلک: ${fieldsMap.get("sect") || "—"}
• ذات / برادری: ${fieldsMap.get("caste") || "—"}
• کل بہن بھائی: ${fieldsMap.get("siblingsCount") || "—"}
• بہن بھائیوں کے پیشے: ${fieldsMap.get("siblingDetails") || "درج نہیں"}
• شادی شدہ بہن بھائی: ${fieldsMap.get("marriedSiblings") || "0"}
• غیر شادی شدہ بہن بھائی: ${fieldsMap.get("unmarriedSiblings") || "0"}

💍 مطلوبہ رشتہ کی شرائط و ضروریات:
${fieldsMap.get("requirements") || "—"}

📝 اضافی معلومات / دیگر ضروریات:
${fieldsMap.get("additionalInfo") || "کوئی نہیں"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
نوٹ: یہ تفصیلات شفاف میرج بیورو کو برائے رشتہ ارسال کی گئی ہیں۔ براہ کرم مکمل رازداری کے ساتھ مناسب رشتہ تجویز فرمائیں۔`;

      return /[A-Za-z]/.test(rebuiltMessage) ? rebuiltMessage : rebuiltMessage;
    }

    return message;
  }

  // Generate Urdu message string from current form inputs
  function buildUrduMessage() {
    const profileType = normalizeUrduText(form.profileType?.value || "", "gender");
    const personName = normalizeUrduText(form.personName?.value || "", "general");
    const fatherName = normalizeUrduText(form.fatherName?.value || "", "general");
    const age = form.age?.value?.trim() ? `${normalizeUrduText(form.age.value, "general")} سال` : "—";
    const height = normalizeUrduText(form.height?.value || "", "general");
    const maritalStatus = normalizeUrduText(form.maritalStatus?.value || "", "marital");
    const hasChildren = form.hasChildren?.value || "no";
    const childrenCount = form.childrenCount?.value?.trim();
    const childrenStr = hasChildren === "yes" ? (childrenCount ? `${normalizeUrduText(childrenCount, "general")} بچے` : "ہاں") : "کوئی بچہ نہیں";
    const complexion = normalizeUrduText(form.complexion?.value || "", "general") || "درج نہیں";

    const qualification = normalizeUrduText(form.qualification?.value || "", "general") || "—";
    const jobProfession = normalizeUrduText(form.jobProfession?.value || "", "general") || "—";

    const agriLand = normalizeUrduText(form.agriLand?.value || "", "general") || "درج نہیں";
    const otherProperty = normalizeUrduText(form.otherProperty?.value || "", "general") || "درج نہیں";

    const sect = normalizeUrduText(form.sect?.value || "", "general") || "—";
    const caste = normalizeUrduText(form.caste?.value || "", "general") || "—";
    const siblingsCount = normalizeUrduText(form.siblingsCount?.value || "", "general") || "—";
    const siblingDetails = normalizeUrduText(form.siblingDetails?.value || "", "general") || "درج نہیں";
    const marriedSiblings = normalizeUrduText(form.marriedSiblings?.value || "0", "general") || "0";
    const unmarriedSiblings = normalizeUrduText(form.unmarriedSiblings?.value || "0", "general") || "0";

    const requirements = normalizeUrduText(form.requirements?.value || "", "general") || "—";
    const additionalInfo = normalizeUrduText(form.additionalInfo?.value || "", "general") || "کوئی نہیں";

    const urduMessage = `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
✨ رشتہ پروفائل - شفاف میرج بیورو ✨
سرپرست: محترم میاں ساجد (18 سالہ قابلِ اعتماد خاندانی خدمات)
فون و واٹس ایپ: 0300 6726233
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 بنیادی معلومات:
• پروفائل برائے: ${profileType || "—"}
• نام: ${personName || "—"}
• والد کا نام: ${fatherName || "—"}
• عمر: ${age || "—"}
• قد: ${height || "—"}
• ازدواجی حیثیت: ${maritalStatus || "—"}
• بچے: ${childrenStr}
• رنگت: ${complexion}

🎓 تعلیم اور پیشہ ورانہ تفصیلات:
• تعلیم: ${qualification}
• ملازمت / کاروبار: ${jobProfession}

🏡 جائیداد و اثاثہ جات:
• زرعی زمین: ${agriLand}
• دیگر جائیداد و رہائش: ${otherProperty}

🕌 خاندانی و سماجی پس منظر:
• مسلک: ${sect}
• ذات / برادری: ${caste}
• کل بہن بھائی: ${siblingsCount}
• بہن بھائیوں کے پیشے: ${siblingDetails}
• شادی شدہ بہن بھائی: ${marriedSiblings}
• غیر شادی شدہ بہن بھائی: ${unmarriedSiblings}

💍 مطلوبہ رشتہ کی شرائط و ضروریات:
${requirements}

📝 اضافی معلومات / دیگر ضروریات:
${additionalInfo}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
نوٹ: یہ تفصیلات شفاف میرج بیورو کو برائے رشتہ ارسال کی گئی ہیں۔ براہ کرم مکمل رازداری کے ساتھ مناسب رشتہ تجویز فرمائیں۔`;

    return ensureUrduOnlyMessage(urduMessage);
  }

  // Live preview update
  function updateLivePreview() {
    if (previewBox) {
      previewBox.textContent = buildUrduMessage();
    }
  }

  // Children count toggle logic
  const hasChildrenSelect = form.querySelector("#hasChildren");
  const childrenCountWrapper = document.getElementById("childrenCountWrapper");
  if (hasChildrenSelect && childrenCountWrapper) {
    hasChildrenSelect.addEventListener("change", () => {
      if (hasChildrenSelect.value === "yes") {
        childrenCountWrapper.style.display = "flex";
      } else {
        childrenCountWrapper.style.display = "none";
        const countInput = form.querySelector("#childrenCount");
        if (countInput) countInput.value = "";
      }
      updateLivePreview();
    });
  }

  // Listen to input changes for live preview
  form.addEventListener("input", updateLivePreview);
  form.addEventListener("change", updateLivePreview);
  updateLivePreview();

  // Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Required fields validation
    const requiredInputs = [
      { field: form.profileType, name: "پروفائل کی قسم (Profile Type)" },
      { field: form.personName, name: "نام (Person Name)" },
      { field: form.fatherName, name: "والد کا نام (Father's Name)" },
      { field: form.age, name: "عمر (Age)" },
      { field: form.height, name: "قد (Height)" },
      { field: form.maritalStatus, name: "ازدواجی حیثیت (Marital Status)" },
      { field: form.qualification, name: "تعلیم (Qualification)" },
      { field: form.jobProfession, name: "ملازمت / کاروبار (Job / Profession)" },
      { field: form.sect, name: "مسلک (Sect)" },
      { field: form.caste, name: "ذات / برادری (Caste / Biradari)" },
      { field: form.requirements, name: "مطلوبہ رشتہ کی شرائط (Requirements)" }
    ];

    let hasError = false;
    let firstErrorField = null;

    // Remove previous error styles
    form.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));

    for (const item of requiredInputs) {
      if (!item.field || !item.field.value.trim()) {
        hasError = true;
        item.field?.classList.add("input-error");
        if (!firstErrorField) {
          firstErrorField = item.field;
        }
      }
    }

    if (hasError) {
      showToast("براہ کرم تمام لازمی خانے پُر کریں (Please fill all required fields)", "error");
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Build the structured Urdu message
    const formattedUrduMessage = buildUrduMessage();

    // URL encode for WhatsApp
    const encodedMessage = encodeURIComponent(formattedUrduMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    showToast("واٹس ایپ پر رشتہ تفصیلات کھولی جا رہی ہیں...", "success");

    // Open WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 600);
  });
}

/* ==========================================================================
   6. GALLERY LIGHTBOX MODAL
   ========================================================================== */
function initGalleryLightbox() {
  const galleryCards = document.querySelectorAll(".gallery-card");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxSubtitle = document.getElementById("lightboxSubtitle");
  const closeBtn = document.getElementById("lightboxCloseBtn");
  const prevBtn = document.getElementById("lightboxPrevBtn");
  const nextBtn = document.getElementById("lightboxNextBtn");

  if (!galleryCards.length || !lightbox) return;

  const galleryData = Array.from(galleryCards).map((card) => {
    const img = card.querySelector(".gallery-img");
    const title = card.querySelector(".gallery-title");
    const caption = card.querySelector(".gallery-caption");
    return {
      src: img ? (img.currentSrc || img.src || img.getAttribute("src")) : "",
      title: title ? title.textContent : "",
      caption: caption ? caption.textContent : ""
    };
  });

  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightboxContent();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightboxContent() {
    const item = galleryData[currentGalleryIndex];
    if (item && lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      if (lightboxTitle) lightboxTitle.textContent = item.title;
      if (lightboxSubtitle) lightboxSubtitle.textContent = item.caption;
    }
  }

  function showNext() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrev() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  galleryCards.forEach((card, index) => {
    card.addEventListener("click", () => openLightbox(index));
  });

  closeBtn?.addEventListener("click", closeLightbox);
  nextBtn?.addEventListener("click", showNext);
  prevBtn?.addEventListener("click", showPrev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
}

/* ==========================================================================
   7. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById("backToTopBtn");
  if (!backBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backBtn.classList.add("show");
    } else {
      backBtn.classList.remove("show");
    }
  }, { passive: true });

  backBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = "success") {
  let toast = document.getElementById("siteToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "siteToast";
    toast.className = "toast-alert";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast-alert show ${type === "error" ? "toast-error" : ""}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

/* ==========================================================================
   9. IMAGE FALLBACKS
   ========================================================================== */
function initImageFallbacks() {
  // If any image fails to load, replace with an elegant Islamic gold placeholder SVG
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230c1117"/><path d="M400 120 L480 200 L560 200 L500 260 L520 340 L440 300 L400 360 L360 300 L280 340 L300 260 L240 200 L320 200 Z" fill="none" stroke="%23d4af37" stroke-width="3" opacity="0.6"/><text x="400" y="440" font-family="serif" font-size="28" fill="%23f3e5ab" text-anchor="middle">شفاف میرج بیورو</text><text x="400" y="480" font-family="sans-serif" font-size="18" fill="%23aa820a" text-anchor="middle">Shafaf Marriage Bureau</text></svg>`;

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      if (this.src !== fallbackSvg) {
        this.src = fallbackSvg;
      }
    });
  });
}

/* ==========================================================================
   10. PRICING PORTAL & ADVANCE PAYMENT MODAL
   ========================================================================== */

// Canonical Package Data Dictionary
const SHARFAF_PACKAGES = {
  basic: {
    id: "basic",
    title: "Basic / Local Package",
    urdu: "بنیادی لوکل پیکیج",
    total: "Rs. 35,000",
    advance: "Rs. 5,000",
    remaining: "Rs. 30,000 (دعا خیر یا منگنی ہونے کی صورت میں)"
  },
  standard: {
    id: "standard",
    title: "Standard Package",
    urdu: "اسٹینڈرڈ خاندانی پیکیج",
    total: "Rs. 35,000",
    advance: "Rs. 5,000",
    remaining: "Rs. 30,000 (دعا خیر یا منگنی ہونے کی صورت میں)"
  },
  premium: {
    id: "premium",
    title: "Premium VIP Package",
    urdu: "پریمیم وی آئی پی پیکیج",
    total: "Rs. 80,000",
    advance: "Rs. 10,000",
    remaining: "Rs. 70,000"
  },
  overseas: {
    id: "overseas",
    title: "Overseas Pakistani Package",
    urdu: "اوورسیز پاکستانی پیکیج",
    total: "Rs. 1,00,000 - Rs. 1,50,000",
    advance: "Rs. 1,00,000",
    remaining: "Rs. 1,50,000"
  }
};

let currentSelectedPackage = SHARFAF_PACKAGES.standard;

function initPricingPortal() {
  // Bind all "Pay Advance" buttons in the pricing section
  const payAdvanceButtons = document.querySelectorAll(".btn-pay-advance");
  payAdvanceButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const pkgId = btn.getAttribute("data-package") || "standard";
      const pkgData = SHARFAF_PACKAGES[pkgId] || {
        id: pkgId,
        title: btn.getAttribute("data-title") || "Selected Package",
        urdu: btn.getAttribute("data-urdu") || "",
        total: btn.getAttribute("data-total") || "",
        advance: btn.getAttribute("data-advance") || "",
        remaining: btn.getAttribute("data-remaining") || ""
      };
      openPaymentModal(pkgData);
    });
  });
}

function openPaymentModal(pkg) {
  currentSelectedPackage = pkg || SHARFAF_PACKAGES.standard;

  const backdrop = document.getElementById("paymentModalBackdrop");
  const summaryName = document.getElementById("modalSummaryName");
  const summaryUrdu = document.getElementById("modalSummaryUrdu");
  const summaryTotal = document.getElementById("modalSummaryTotal");
  const summaryAdvance = document.getElementById("modalSummaryAdvance");
  const summaryRemaining = document.getElementById("modalSummaryRemaining");
  const nameInput = document.getElementById("paymentClientName");
  const phoneInput = document.getElementById("paymentClientPhone");
  const nameError = document.getElementById("nameErrorMsg");
  const phoneError = document.getElementById("phoneErrorMsg");

  if (!backdrop) return;

  // Populate dynamic package details
  if (summaryName) summaryName.textContent = currentSelectedPackage.title;
  if (summaryUrdu) summaryUrdu.textContent = currentSelectedPackage.urdu;
  if (summaryTotal) summaryTotal.textContent = currentSelectedPackage.total;
  if (summaryAdvance) summaryAdvance.textContent = currentSelectedPackage.advance;
  if (summaryRemaining) summaryRemaining.textContent = currentSelectedPackage.remaining;

  // Clear previous validation and inputs
  if (nameInput) {
    nameInput.classList.remove("input-error");
  }
  if (phoneInput) {
    phoneInput.classList.remove("input-error");
  }
  if (nameError) nameError.classList.remove("visible");
  if (phoneError) phoneError.classList.remove("visible");

  // Open modal
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus name field
  setTimeout(() => {
    nameInput?.focus();
  }, 100);
}

function closePaymentModal() {
  const backdrop = document.getElementById("paymentModalBackdrop");
  if (!backdrop) return;
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Expose globally for any external triggers
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;

function initPaymentModal() {
  const backdrop = document.getElementById("paymentModalBackdrop");
  const modalBox = document.getElementById("paymentModal");
  const closeBtn = document.getElementById("paymentModalClose");
  const sendBtn = document.getElementById("btnSendScreenshotWhatsapp");
  const nameInput = document.getElementById("paymentClientName");
  const phoneInput = document.getElementById("paymentClientPhone");
  const cityInput = document.getElementById("paymentClientCity");
  const ageInput = document.getElementById("paymentClientAge");
  const genderInput = document.getElementById("paymentClientGender");
  const maritalStatusInput = document.getElementById("paymentClientMaritalStatus");
  const educationInput = document.getElementById("paymentClientEducation");
  const professionInput = document.getElementById("paymentClientProfession");
  const residenceInput = document.getElementById("paymentClientResidence");
  const requirementsInput = document.getElementById("paymentClientRequirements");
  const nameError = document.getElementById("nameErrorMsg");
  const phoneError = document.getElementById("phoneErrorMsg");
  const copyButtons = document.querySelectorAll(".pm-copy-btn");

  if (!backdrop) return;

  // Close handlers
  closeBtn?.addEventListener("click", closePaymentModal);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closePaymentModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("open")) {
      closePaymentModal();
    }
  });

  // Copy account numbers & wallet numbers
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-copy-target");
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const textToCopy = targetEl.textContent.trim();
      if (!textToCopy) return;

      const performCopySuccess = () => {
        const originalText = btn.textContent;
        btn.textContent = "✓ Copied!";
        btn.style.background = "var(--gold-primary)";
        btn.style.color = "#07090c";

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "";
          btn.style.color = "";
        }, 1500);

        showToast(`اکاؤنٹ نمبر کاپی ہو گیا: ${textToCopy}`, "success");
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(performCopySuccess)
          .catch(() => {
            fallbackCopyText(textToCopy);
            performCopySuccess();
          });
      } else {
        fallbackCopyText(textToCopy);
        performCopySuccess();
      }
    });
  });

  function fallbackCopyText(text) {
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    tempInput.style.position = "fixed";
    tempInput.style.left = "-9999px";
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Copy failed", err);
    }
    document.body.removeChild(tempInput);
  }

  // Clear errors on user typing
  nameInput?.addEventListener("input", () => {
    nameInput.classList.remove("input-error");
    nameError?.classList.remove("visible");
  });

  phoneInput?.addEventListener("input", () => {
    phoneInput.classList.remove("input-error");
    phoneError?.classList.remove("visible");
  });

  // ── Urdu conversion helpers for payment modal ──────────────────────────────

  // Comprehensive English-to-Urdu lookup (exact-word replacements)
  const URDU_WORD_MAP = {
    // Gender
    "male": "مرد", "female": "خاتون", "man": "مرد", "woman": "خاتون",
    "boy": "لڑکا", "girl": "لڑکی",

    // Marital status
    "never married": "غیر شادی شدہ", "unmarried": "غیر شادی شدہ",
    "single": "غیر شادی شدہ", "married": "شادی شدہ",
    "divorced": "طلاق یافتہ", "widowed": "بیوہ",
    "widow": "بیوہ", "widower": "رنڈوا",

    // Education
    "phd": "پی ایچ ڈی", "ph.d": "پی ایچ ڈی", "ph.d.": "پی ایچ ڈی",
    "master": "ماسٹرز", "masters": "ماسٹرز", "m.a": "ماسٹرز", "msc": "ماسٹرز",
    "bachelor": "بیچلرز", "bachelors": "بیچلرز", "b.a": "بیچلرز",
    "b.sc": "بیچلرز", "bsc": "بیچلرز", "ba": "بیچلرز",
    "mbbs": "ایم بی بی ایس", "bds": "بی ڈی ایس",
    "mba": "ایم بی اے", "llb": "ایل ایل بی",
    "matric": "میٹرک", "fsc": "ایف ایس سی", "fa": "ایف اے",
    "intermediate": "انٹرمیڈیٹ", "graduate": "گریجویٹ",

    // Professions
    "doctor": "ڈاکٹر", "engineer": "انجینئر",
    "businessman": "کاروباری شخصیت", "business": "کاروبار",
    "teacher": "استاد", "professor": "پروفیسر",
    "lawyer": "وکیل", "advocate": "وکیل",
    "accountant": "اکاؤنٹنٹ", "banker": "بینکر",
    "government job": "سرکاری ملازمت", "govt job": "سرکاری ملازمت",
    "private job": "نجی ملازمت", "job": "ملازمت",
    "student": "طالب علم", "housewife": "گھریلو خاتون",
    "army": "فوج", "police": "پولیس",
    "farmer": "کاشتکار", "contractor": "کنٹریکٹر",

    // Pakistani cities
    "islamabad": "اسلام آباد", "rawalpindi": "راولپنڈی",
    "lahore": "لاہور", "karachi": "کراچی",
    "multan": "ملتان", "faisalabad": "فیصل آباد",
    "peshawar": "پشاور", "quetta": "کوئٹہ",
    "rahim yar khan": "رحیم یار خان", "hyderabad": "حیدرآباد",
    "gujranwala": "گجرانوالہ", "sialkot": "سیالکوٹ",
    "bahawalpur": "بہاولپور", "sargodha": "سرگودھا",
    "sukkur": "سکھر", "larkana": "لاڑکانہ",
    "abbottabad": "ایبٹ آباد", "mardan": "مردان",

    // Property / residence
    "acre": "ایکڑ", "acres": "ایکڑ",
    "shop": "دکان", "shops": "دکانیں",
    "car": "گاڑی", "cars": "گاڑیاں",
    "house": "گھر", "houses": "گھر",
    "plot": "پلاٹ", "plots": "پلاٹ",
    "flat": "فلیٹ", "apartment": "اپارٹمنٹ",

    // Siblings / family
    "brother": "بھائی", "brothers": "بھائی",
    "sister": "بہن", "sisters": "بہنیں",
    "elder brother": "بڑے بھائی", "elder brothers": "بڑے بھائی",
    "younger brother": "چھوٹے بھائی", "younger brothers": "چھوٹے بھائی",
    "elder sister": "بڑی بہن", "elder sisters": "بڑی بہنیں",
    "younger sister": "چھوٹی بہن", "younger sisters": "چھوٹی بہنیں",

    // Complexion
    "fair": "صاف", "wheatish": "گندمی", "dark": "سانولا", "white": "سفید",

    // Units
    "year": "سال", "years": "سال",
    "feet": "فٹ", "foot": "فٹ", "ft": "فٹ",

    // Common words
    "and": "اور", "with": "کے ساتھ", "no": "نہیں", "yes": "ہاں",
    "one": "ایک", "two": "دو", "three": "تین", "four": "چار",
    "five": "پانچ", "six": "چھ", "seven": "سات",
    "eight": "آٹھ", "nine": "نو", "ten": "دس",
    "older": "بڑے", "elder": "بڑے", "younger": "چھوٹے"
  };

  // Common Pakistani name transliterations
  const URDU_NAMES = {
    "sajid": "ساجد", "saim": "صائم", "ahmed": "احمد", "ahmad": "احمد",
    "muhammad": "محمد", "mohammed": "محمد", "ali": "علی", "usman": "عثمان",
    "uthman": "عثمان", "hamza": "حمزہ", "zain": "زین", "zainab": "زینب",
    "ayesha": "عائشہ", "aisha": "عائشہ", "fatima": "فاطمہ", "fatimah": "فاطمہ",
    "khadija": "خدیجہ", "maryam": "مریم", "mariam": "مریم",
    "bilal": "بلال", "imran": "عمران", "farhan": "فرہان",
    "rashid": "رشید", "noor": "نور", "khan": "خان", "qamar": "قمر",
    "bashir": "بشیر", "akram": "اکرم", "hussain": "حسین", "hasan": "حسن",
    "hassan": "حسن", "raza": "رضا", "naeem": "نعیم", "waqas": "وقاص",
    "asad": "اسد", "tariq": "طارق", "khalid": "خالد", "adnan": "عدنان",
    "omar": "عمر", "umer": "عمر", "danish": "دانش", "faisal": "فیصل",
    "asif": "آصف", "zafar": "ظفر", "shoaib": "شعیب", "kamran": "کامران",
    "shahid": "شاہد", "salman": "سلمان", "rizwan": "رضوان", "owais": "اویس",
    "mian": "میاں", "rana": "رانا", "malik": "ملک", "chaudhry": "چودھری",
    "saeed": "سعید", "pervaiz": "پرویز", "nawaz": "نواز", "tahir": "طاہر",
    "sabir": "صابر", "nazir": "نذیر", "zahid": "زاہد", "waseem": "وسیم",
    "amjad": "امجد", "arif": "عارف", "iqbal": "اقبال", "shafiq": "شفیق",
    "rafiq": "رفیق", "munir": "منیر", "nasir": "ناصر", "tanveer": "تنویر",
    "sana": "ثناء", "sara": "سارہ", "sarah": "سارہ", "amna": "آمنہ",
    "hina": "حنا", "nadia": "نادیہ", "rabia": "رابعہ", "samina": "سمینہ",
    "rukhsana": "رخسانہ", "shazia": "شازیہ", "bushra": "بشریٰ",
    "shaista": "شائستہ", "lubna": "لبنیٰ", "uzma": "عظمیٰ"
  };

  /**
   * Convert any English text to natural Urdu.
   * Handles: categorical values, Pakistani cities, names, units, measurements.
   */
  function convertToUrdu(rawText) {
    if (!rawText || rawText === "—") return rawText || "—";
    let text = String(rawText).trim();
    if (!text) return "—";

    // 1. Try exact full-string match first (case-insensitive)
    const lower = text.toLowerCase().trim();
    if (URDU_WORD_MAP[lower]) return URDU_WORD_MAP[lower];
    if (URDU_NAMES[lower]) return URDU_NAMES[lower];

    // 2. Replace multi-word phrases first (longer phrases before shorter words)
    const sortedPhrases = Object.keys(URDU_WORD_MAP).sort((a, b) => b.length - a.length);
    let result = text;
    for (const phrase of sortedPhrases) {
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      result = result.replace(regex, URDU_WORD_MAP[phrase]);
    }

    // 3. Replace known names word by word
    const nameKeys = Object.keys(URDU_NAMES).sort((a, b) => b.length - a.length);
    for (const name of nameKeys) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      result = result.replace(regex, URDU_NAMES[name]);
    }

    // 4. Transliterate any remaining ASCII words using a character map
    const CHAR_MAP = {
      a: "ا", b: "ب", c: "س", d: "ڈ", e: "ی", f: "ف", g: "گ",
      h: "ح", i: "ی", j: "ج", k: "ک", l: "ل", m: "م", n: "ن",
      o: "و", p: "پ", q: "ق", r: "ر", s: "س", t: "ٹ", u: "یو",
      v: "وی", w: "و", x: "کس", y: "ی", z: "ز"
    };

    result = result.replace(/[a-zA-Z]+/g, (match) => {
      const matchLower = match.toLowerCase();
      // Check maps again in case regex missed
      if (URDU_WORD_MAP[matchLower]) return URDU_WORD_MAP[matchLower];
      if (URDU_NAMES[matchLower]) return URDU_NAMES[matchLower];
      // Transliterate character-by-character
      return Array.from(matchLower).map(ch => CHAR_MAP[ch] || ch).join("");
    });

    return result.trim() || "—";
  }

  /**
   * Convert a name string to Urdu (transliterates each word individually).
   */
  function convertNameToUrdu(nameStr) {
    if (!nameStr || nameStr === "—") return nameStr || "—";
    // Split on spaces and convert each word
    return nameStr.split(/\s+/).map(word => convertToUrdu(word)).join(" ");
  }

  /**
   * Convert age with Urdu unit suffix.
   */
  function convertAgeToUrdu(ageStr) {
    if (!ageStr || ageStr === "—") return ageStr || "—";
    // Strip existing 'years/year/سال' and return digits + سال
    const digits = ageStr.replace(/[^\d.]/g, "").trim();
    return digits ? `${digits} سال` : convertToUrdu(ageStr);
  }

  // Submit and launch WhatsApp with payment screenshot prompt
  sendBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    const clientName = nameInput?.value?.trim() || "";
    const clientPhone = phoneInput?.value?.trim() || "";
    const clientCity = cityInput?.value?.trim() || "";
    const clientAge = ageInput?.value?.trim() || "";
    const clientGender = genderInput?.value?.trim() || "";
    const clientMaritalStatus = maritalStatusInput?.value?.trim() || "";
    const clientEducation = educationInput?.value?.trim() || "";
    const clientProfession = professionInput?.value?.trim() || "";
    const clientResidence = residenceInput?.value?.trim() || "";
    const clientRequirements = requirementsInput?.value?.trim() || "";

    let hasError = false;

    if (!clientName) {
      nameInput?.classList.add("input-error");
      nameError?.classList.add("visible");
      hasError = true;
    } else {
      nameInput?.classList.remove("input-error");
      nameError?.classList.remove("visible");
    }

    if (!clientPhone) {
      phoneInput?.classList.add("input-error");
      phoneError?.classList.add("visible");
      hasError = true;
    } else {
      phoneInput?.classList.remove("input-error");
      phoneError?.classList.remove("visible");
    }

    if (hasError) {
      if (!clientName) {
        nameInput?.focus();
      } else if (!clientPhone) {
        phoneInput?.focus();
      }
      showToast("براہ کرم اپنا نام اور موبائل نمبر درج فرمائیں", "error");
      return;
    }

    const pkg = currentSelectedPackage || SHARFAF_PACKAGES.standard;

    // ── Convert every customer-entered value to Urdu before building the message ──
    const urduName        = convertNameToUrdu(clientName)          || "—";
    const urduCity        = convertToUrdu(clientCity)              || "—";
    const urduAge         = clientAge ? convertAgeToUrdu(clientAge) : "—";
    const urduGender      = convertToUrdu(clientGender)            || "—";
    const urduMarital     = convertToUrdu(clientMaritalStatus)     || "—";
    const urduEducation   = convertToUrdu(clientEducation)         || "—";
    const urduProfession  = convertToUrdu(clientProfession)        || "—";
    const urduResidence   = convertToUrdu(clientResidence)         || "—";
    const urduRequirements = convertToUrdu(clientRequirements)     || "—";

    const paymentUrduMessage = `السلام علیکم
شفاف میرج بیورو کے لیے نئی تفصیلات:

پیکج:
${pkg.urdu || pkg.title}

نام:
${urduName}

موبائل نمبر:
${clientPhone}

شہر:
${urduCity}

عمر:
${urduAge}

جنس:
${urduGender}

ازدواجی حیثیت:
${urduMarital}

تعلیم:
${urduEducation}

پیشہ:
${urduProfession}

رہائش:
${urduResidence}

توقعات / مطلوبہ رشتہ:
${urduRequirements}

رجسٹریشن فیس:
${pkg.advance}

باقی فیس:
${pkg.remaining}

شکریہ
شفاف میرج بیورو`;

    const encodedMsg = encodeURIComponent(paymentUrduMessage);
    const whatsappUrl = `https://wa.me/923006726233?text=${encodedMsg}`;

    showToast("واٹس ایپ کھولا جا رہا ہے... براہ کرم سکرین شاٹ بھیجیں", "success");

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      closePaymentModal();
    }, 600);
  });
}
