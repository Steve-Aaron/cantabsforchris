$(function () {
  // AOS Init
  AOS.init({ duration: 350, easing: "ease", once: true });

  // Intersection observer for .endorsement-card
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            $(e.target).addClass("in-view");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    $(".endorsement-card").each((_, el) => obs.observe(el));
  } else {
    $(".endorsement-card").addClass("in-view");
  }

  // Countdown to July 9, 2025
  const updateCountdown = () => {
    const now = new Date(),
      voteDay = new Date("2025-07-09T10:00:00+0100");
    const diff = Math.max(0, Math.ceil((voteDay - now) / (1000 * 3600 * 24)));
    $("#days-remaining").text(diff);
    if (diff === 0) {
      const end = new Date("2025-07-18T17:00:00+0100");
      $("#voting-countdown").text(
        now < end ? "Voting is open now!" : "Voting has ended"
      );
    } else {
      $("#voting-countdown").html(
        `<span id="days-remaining">${diff}</span> days until voting`
      );
    }
  };
  updateCountdown();

  // Nav toggle
  $(".nav-toggle").on("click", function () {
    $(this).toggleClass("active");
    $(".nav-overlay").toggleClass("active");
    $("body").toggleClass("no-scroll");
  });

  $(".close-nav, .nav-list a").on("click", function () {
    $(".nav-toggle, .nav-overlay").removeClass("active");
    $("body").removeClass("no-scroll");
  });

  // Make endorsement slides visible
  $(".endorsement-slide")
    .addClass("active")
    .css({ position: "relative", opacity: 1, visibility: "visible" });

  // Modal open/close
  $("#read-full-statement").on("click", () => {
    $("#statement-modal").addClass("active");
    $("body").css("overflow", "hidden");
  });

  $(".modal-close, #statement-modal").on("click", function (e) {
    if (e.target === this) {
      $("#statement-modal").removeClass("active");
      $("body").css("overflow", "");
    }
  });

  $(".learn-more-btn").on("click", function () {
    const sectionId = $(this).data("section");
    $("#statement-modal").addClass("active");
    $("body").css("overflow", "hidden");
    setTimeout(() => {
      const $target = $(`#${sectionId}`);
      if ($target.length) {
        $target[0].scrollIntoView({ behavior: "smooth", block: "start" });
        $target.addClass("highlight-section");
        setTimeout(() => $target.removeClass("highlight-section"), 1500);
      }
    }, 400);
  });

  // Parallax scroll
  $(window).on("scroll", function () {
    const scrollY = window.scrollY;
    $(".section").each(function () {
      const $s = $(this),
        offsetY = $s.offset().top,
        h = $s.outerHeight();
      if (
        scrollY > offsetY - window.innerHeight &&
        scrollY < offsetY + h &&
        $s.hasClass("hero")
      ) {
        const speed = parseFloat($s.data("speed")) || 0.1;
        $s.find(".hero-background").css(
          "transform",
          `translateY(${(scrollY - offsetY) * speed}px)`
        );
      }
    });
  });

  // Smooth scroll
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    const target = $($(this).attr("href"));
    if (target.length) {
      $("html, body").animate({ scrollTop: target.offset().top }, 600);
    }
  });

  // Reveal observer
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          $(e.target).addClass("active");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  $(".reveal").each((_, el) => revealObs.observe(el));

  // Timeline observer
  const timelineObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => $(e.target).addClass("visible"), 100);
          timelineObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "-30px" }
  );
  $(".timeline-item").each((_, el) => timelineObs.observe(el));
});

// Campaign form submission with Brevo API
$('#campaign-form').on('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  const data = {
    email: formData.get('EMAIL'),
    attributes: {
      FIRSTNAME: formData.get('FNAME'),
      LASTNAME: formData.get('LNAME'),
      COLLEGE: formData.get('COLLEGE') || '',
      JOB_TITLE: formData.get('JOB_TITLE') || '',
      COMPANY: formData.get('COMPANY') || ''
    },
    listIds: [3],
    updateEnabled: true,
    emailBlacklisted: formData.get('EMAIL_CONSENT') !== 'yes'
  };

  fetch('https://chrissmith-apis.steve-42e.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.ok) window.location.href = './../thankyou.html';
    else alert('There was an error submitting your form.');
  })
  .catch(err => {
    console.error('Form submission error:', err);
    alert('There was an error submitting your form.');
  });
});


$(window).on("scroll", function () {
  const scrollY = window.scrollY;
  const $bg = $(".hero-background");
  if ($bg.length) {
    $bg.css("transform", `translateY(${scrollY * 0.15}px)`);
  }
});