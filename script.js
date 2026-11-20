const milestones = document.querySelectorAll(".milestone");
const timeline = document.querySelector(".timeline");
const progressLine = document.querySelector(".timeline-progress");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Animate the number from 0 to its target
function countUp(element) {
  const target = Number(element.dataset.target);

  if (reduceMotion) {
    element.textContent = target;
    return;
  }

  const duration = 1000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Slow down toward the end
    const eased = 1 - Math.pow(1 - progress, 3);

    element.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Detect milestones as the visitor scrolls
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const milestone = entry.target;

        milestone.classList.add("active");

        const number = milestone.querySelector(".milestone-number");

        if (number && !milestone.dataset.animated) {
          countUp(number);
          milestone.dataset.animated = "true";
        }

        observer.unobserve(milestone);
      }
    });
  },
  {
    threshold: 0.35
  }
);

milestones.forEach((milestone) => {
  observer.observe(milestone);
});

// Animate the purple line as the visitor scrolls
function updateTimeline() {
  if (!timeline || !progressLine) return;

  const rect = timeline.getBoundingClientRect();

  const progress = Math.max(
    0,
    Math.min(
      rect.height,
      window.innerHeight * 0.5 - rect.top
    )
  );

  progressLine.style.height = progress + "px";
}

window.addEventListener("scroll", updateTimeline, {
  passive: true
});

window.addEventListener("resize", updateTimeline);

updateTimeline();
