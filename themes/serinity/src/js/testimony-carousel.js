import { calculateElementsWidth } from "./utils";

/**
 * Card class to manage individual carousel cards
 */
class SerinityCarouselCard {
  /**
   * Constructor for SerinityCarouselCard
   * @param {HTMLElement} element - The card element
   * @param {Object} options - Options for the card
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;

    // Initialize states
    this.opacity = options.randomOpacity ? Math.random() * 0.5 + 0.5 : 1;
    this.blur = 0;
    this.timeCounter = Math.random() * 100; // Random starting point for time-based animation
    this.timeSpeed = 0.02 + Math.random() * 0.03; // Random speed for time-based animation

    // Apply initial styles
    this.updateAppearance();
  }

  /**
   * Update card based on its position in the container
   * @param {number} containerLeft - Left edge of container
   * @param {number} containerRight - Right edge of container
   * @param {number} fadeZoneWidth - Width of the fade zone
   */
  updatePositionOpacity(containerLeft, containerRight, fadeZoneWidth) {
    // Calculate element's current position relative to container
    const rect = this.element.getBoundingClientRect();
    const containerRect = this.element.parentElement.parentElement.getBoundingClientRect();
    const left = rect.left - containerRect.left;
    const right = rect.right - containerRect.left;

    // Skip if element is completely outside the visible area
    if (right < containerLeft || left > containerRight) {
      this.positionOpacity = 0.2;
      return;
    }

    // Calculate opacity based on position in fade zones
    let positionOpacity = 1;

    // Left fade zone - incorporate containerLeft
    if (left < containerLeft + fadeZoneWidth) {
      positionOpacity = 0.2 + 0.8 * ((left - containerLeft) / fadeZoneWidth);
    }
    // Right fade zone
    else if (right > containerRight - fadeZoneWidth) {
      positionOpacity = 0.2 + 0.8 * ((containerRight - right) / fadeZoneWidth);
    }

    this.positionOpacity = Math.max(0.2, Math.min(1, positionOpacity));
    this.updateAppearance();
  }

  /**
   * Update the time-based animation state
   */
  updateTimeState() {
    // Increment time counter
    this.timeCounter += this.timeSpeed;
    if (this.timeCounter > 100) this.timeCounter = 0;

    // Calculate sine wave oscillation for organic feel
    const wave = Math.sin(this.timeCounter * 0.1);

    // Update time-based states
    this.timeOpacity = 0.7 + wave * 0.3; // Oscillate between 0.4 and 1.0
    this.blur = Math.abs(wave) * 1.5; // Oscillate between 0 and 1.5px blur

    this.updateAppearance();
  }

  /**
   * Update the visual appearance of the card
   */
  updateAppearance() {
    // Calculate final opacity from both position and time factors
    const finalOpacity = (this.positionOpacity || 1) * (this.timeOpacity || 1) * this.opacity;
    this.element.style.opacity = Math.max(0.2, Math.min(1, finalOpacity)).toString();

    // Apply blur effect
    if (this.blur > 0) {
      this.element.style.filter = `blur(${this.blur}px)`;
    } else {
      this.element.style.filter = "none";
    }
  }

  /**
   * Handle hover state
   * @param {boolean} isHovering - Whether the card is being hovered
   */
  setHover(isHovering) {
    if (isHovering) {
      this.element.style.opacity = "1";
      this.element.style.filter = "none";
      this.element.style.transform = "translateY(-5px)";
      this.element.style.zIndex = "5";
    } else {
      this.updateAppearance();
      this.element.style.transform = "";
      this.element.style.zIndex = "";
    }
  }
}

/**
 * Carousel for Serinity Theme
 */
export class SerinityCarousel {
  /**
   * Constructor for the SerinityCarousel
   * @param {HTMLElement} containerElement - The container element for this carousel
   * @param {string} cardSelector - CSS selector for individual cards inside the container
   * @param {Object} options - Configuration options
   */
  constructor(containerElement, cardSelector, options = {}) {
    this.container = containerElement;
    this.cardSelector = cardSelector;
    this.options = {
      direction: "left", // "left" or "right"
      speed: 0.5, // Pixels per frame
      randomOpacity: false, // Randomize initial opacity
      timeBasedAnimation: true, // Enable time-based animation
      viewportOffset: 0, // Offset from left edge for custom viewport
      viewportWidth: null, // Custom viewport width (null = use container width)
      static: false, // If true, disable translation movement
      ...options,
    };

    // Set scroll speed based on direction (only if not static)
    this.scrollSpeed = this.options.static
      ? 0
      : this.options.direction === "right"
      ? -this.options.speed
      : this.options.speed;

    this.isPaused = false;
    this.animationId = null;

    // Initialize the carousel
    this.init();
  }

  /**
   * Initialize the carousel
   */
  init() {
    // Set up the container styling
    this.setupContainer();

    // Set up event listeners
    this.setupEventListeners();

    // Start the animation
    this.startAnimation();
  }

  /**
   * Set up the container with necessary CSS properties
   */
  setupContainer() {
    // Set container style
    this.container.style.width = "100vw";
    this.container.style.maxWidth = "100%";
    this.container.style.overflowX = "hidden";
    this.container.style.overflowY = "hidden";
    this.container.style.position = "relative";
    this.container.style.margin = "0 calc(-50vw + 50%)";
    this.container.style.left = "0";

    // Create inner wrapper for scrolling
    this.scrollWrapper = document.createElement("div");
    this.scrollWrapper.className = "serinity-carousel-wrapper";
    this.scrollWrapper.style.display = "flex";
    this.scrollWrapper.style.position = "relative";

    // Store container dimensions
    this.containerWidth = this.container.offsetWidth;
    this.fadeZoneWidth = Math.min(this.containerWidth * 0.15, 100);

    // Get all carousel cards
    const carouselCards = Array.from(this.container.querySelectorAll(this.cardSelector));

    // Store the original cards
    this.originalCarouselCards = carouselCards;

    // Move all cards to the wrapper
    carouselCards.forEach((card) => {
      card.style.flexShrink = "0";
      card.style.margin = "0 15px";
      card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      this.scrollWrapper.appendChild(card);
    });

    // Add the wrapper back to the container
    this.container.appendChild(this.scrollWrapper);

    // Create clones for the infinite scroll if not static
    if (!this.options.static) {
      this.createClones();
    } else {
      this.allCarouselCards = this.originalCarouselCards;
    }

    // Calculate dimensions
    this.calculateDimensions();

    // Create card objects for each card
    this.initializeCards();
  }

  /**
   * Create clones for infinite scrolling
   */
  createClones() {
    const className = this.cardSelector.replace(/^[.#]/, "");
    // Two sets of clones - one at the beginning and one at the end
    this.originalCarouselCards.forEach((card) => {
      const preClone = card.cloneNode(true);
      preClone.setAttribute("aria-hidden", "true");
      preClone.classList.add(`${className}-clone`);
      this.scrollWrapper.insertBefore(preClone, this.scrollWrapper.firstChild);

      const postClone = card.cloneNode(true);
      postClone.setAttribute("aria-hidden", "true");
      postClone.classList.add(`${className}-clone`);
      this.scrollWrapper.appendChild(postClone);
    });

    // Get all cards including clones
    this.allCarouselCards = Array.from(this.scrollWrapper.querySelectorAll(this.cardSelector));
  }

  /**
   * Initialize card objects for each carousel card
   */
  initializeCards() {
    this.cards = this.allCarouselCards.map((carouselCard) => {
      const card = new SerinityCarouselCard(carouselCard, {
        randomOpacity: this.options.randomOpacity,
      });

      // Add hover listeners
      carouselCard.addEventListener("mouseenter", () => {
        card.setHover(true);
      });

      carouselCard.addEventListener("mouseleave", () => {
        card.setHover(false);
      });

      return card;
    });
  }

  /**
   * Calculate dimensions needed for the animation
   */
  calculateDimensions() {
    // Calculate viewport dimensions
    this.viewportLeft = this.options.viewportOffset || 0;
    this.viewportWidth = this.options.viewportWidth || this.containerWidth;
    this.viewportRight = this.viewportLeft + this.viewportWidth;

    // Calculate single set width
    this.singleSetWidth = calculateElementsWidth(this.originalCarouselCards);

    // In static mode, center the items in the container
    if (this.options.static) {
      // Center the items
      const offset = (this.containerWidth - this.singleSetWidth) / 2;
      // this.scrollPosition = this.singleSetWidth - offset;
      // For static mode, we want to move RIGHT by offset amount
      // Since we're using negative transform values, we need to set scrollPosition
      // to a negative value
      this.scrollPosition = -offset;
    } else {
      // Normal mode - start position at one set width
      this.scrollPosition = this.singleSetWidth;
    }

    // Apply initial position
    this.scrollWrapper.style.transform = `translateX(-${this.scrollPosition}px)`;

    // Get center point of container for opacity calculations
    this.containerCenter = this.container.offsetWidth / 2;
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Pause on hover/touch
    this.container.addEventListener("mouseenter", () => {
      this.isPaused = true;
    });

    this.container.addEventListener("mouseleave", () => {
      this.isPaused = false;
    });

    this.container.addEventListener("touchstart", () => {
      this.isPaused = true;
    });

    this.container.addEventListener("touchend", () => {
      this.isPaused = false;
    });

    // Pause when tab is inactive
    document.addEventListener("visibilitychange", () => {
      this.isPaused = document.hidden;
    });

    // Handle resize
    window.addEventListener("resize", () => {
      this.containerWidth = this.container.offsetWidth;
      this.fadeZoneWidth = Math.min(this.containerWidth * 0.15, 100);
      this.containerCenter = this.containerWidth / 2;
      this.calculateDimensions();
      this.updateCardAppearance();
    });
  }

  /**
   * Update appearance of all cards
   */
  updateCardAppearance() {
    this.cards.forEach((card) => {
      card.updatePositionOpacity(this.viewportLeft, this.viewportRight, this.fadeZoneWidth);

      if (this.options.timeBasedAnimation) {
        card.updateTimeState();
      }
    });
  }

  /**
   * Start the animation loop
   */
  startAnimation() {
    const animate = () => {
      if (!this.isPaused && !this.options.static) {
        // Increment scroll position
        this.scrollPosition += this.scrollSpeed;

        // Check for reset
        if (this.scrollSpeed > 0 && this.scrollPosition >= this.singleSetWidth * 2) {
          // Reset when scrolling left
          this.scrollPosition = this.singleSetWidth;
        } else if (this.scrollSpeed < 0 && this.scrollPosition <= 0) {
          // Reset when scrolling right
          this.scrollPosition = this.singleSetWidth;
        }

        // Apply the transform
        this.scrollWrapper.style.transform = `translateX(-${this.scrollPosition}px)`;
      }

      // Always update card appearances, even in static mode
      this.updateCardAppearance();

      // Continue animation
      this.animationId = requestAnimationFrame(animate);
    };

    // Start animation
    this.animationId = requestAnimationFrame(animate);
  }

  /**
   * Shows visual debug indicators for fade zones
   * Call this method after initialization to show the zones
   */
  showDebugZones() {
    // Remove any existing debug elements
    const existing = this.container.querySelectorAll(".serinity-debug-zone");
    existing.forEach((el) => el.remove());

    // Create left fade zone indicator
    const leftZone = document.createElement("div");
    leftZone.className = "serinity-debug-zone serinity-debug-zone-left";
    leftZone.style.cssText = `
    position: absolute;
    top: 0;
    left: ${this.viewportLeft}px;
    width: ${this.fadeZoneWidth}px;
    height: 100%;
    border: 2px solid red;
    background: rgba(255, 0, 0, 0.1);
    z-index: 1000;
    pointer-events: none;
  `;

    // Create right fade zone indicator
    const rightZone = document.createElement("div");
    rightZone.className = "serinity-debug-zone serinity-debug-zone-right";
    rightZone.style.cssText = `
    position: absolute;
    top: 0;
    right: ${this.containerWidth - this.viewportRight}px;
    width: ${this.fadeZoneWidth}px;
    height: 100%;
    border: 2px solid red;
    background: rgba(255, 0, 0, 0.1);
    z-index: 1000;
    pointer-events: none;
  `;

    // Add the indicators to the container
    this.container.appendChild(leftZone);
    this.container.appendChild(rightZone);

    // Optional: Add viewport bounds indicator
    if (this.viewportLeft > 0 || this.viewportRight < this.containerWidth) {
      const viewport = document.createElement("div");
      viewport.className = "serinity-debug-zone serinity-debug-viewport";
      viewport.style.cssText = `
      position: absolute;
      top: 0;
      left: ${this.viewportLeft}px;
      width: ${this.viewportWidth}px;
      height: 100%;
      border: 2px dashed blue;
      background: rgba(0, 0, 255, 0.05);
      z-index: 900;
      pointer-events: none;
    `;
      this.container.appendChild(viewport);
    }

    console.log(
      "Debug zones added. Left zone width:",
      this.fadeZoneWidth,
      "Right zone width:",
      this.fadeZoneWidth,
      "Viewport:",
      this.viewportLeft,
      this.viewportRight
    );
  }

  /**
   * Stop animation and clean up
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

/**
 * Initialize carousels with a selector and options
 * @param {string} containerSelector - CSS selector for carousel containers
 * @param {Object} options - Configuration options
 */
export function initCarousels(containerSelector, cardSelector, options = {}) {
  const containers = document.querySelectorAll(containerSelector);

  if (containers.length === 0) return [];

  const carousels = [];
  containers.forEach((containerElement) => {
    carousels.push(new SerinityCarousel(containerElement, cardSelector, options));
  });

  return carousels;
}
