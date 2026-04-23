import config from "../config.json" assert { type: "json" };

export class ConfigHandler {
  constructor() {
    // State
    this.isOpen = false;
    this.config = config;
    this.inputElements = {};

    // Store references to DOM elements
    this.overlay = null;
    this.panel = null;
    this.closeBtn = null;
    this.clearBtn = null;
    // Store the handler function reference so we can remove it later
    this.handleKeyDown = this._handleKeyDown.bind(this);

    // Initialize immediately
    this.init();
  }

  init() {
    this._createOverlayStructure();
    this._attachEventListeners();
    this._createOptions();
  }

  _createOverlayStructure() {
    // Create the backdrop
    this.overlay = document.createElement("div");
    this.overlay.id = "configOverlay";
    this.overlay.style.cssText = `
        margin: 0;
      display: none;
      position: fixed;
      flex-direction: column;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      overflow-y: auto; /* Enables vertical scrolling */
    `;

    // Create Close Button (X)
    this.closeBtn = document.createElement("button");
    this.closeBtn.innerHTML = "&times;";
    this.closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #fff;
    `;
    this.closeBtn.onclick = () => this.closeConfig();

    // Create Header
    const header = document.createElement("h2");

    header.textContent = "Configuration";
    header.style.margin = "16px";
    header.style.color = "white";
    header.style.width = "100%";

    // Assemble the overlay
    this.overlay.appendChild(this.closeBtn);
    this.overlay.appendChild(header);

    // Append to body
    document.body.appendChild(this.overlay);
  }

  _createOptions() {
    for (const option in this.config) {
      const wrapper = document.createElement("div");
      wrapper.style.margin = "4px";

      // create label
      const lbl = document.createElement("label");
      lbl.textContent = this.config[option].label;
      lbl.style.fontSize = "20px";
      lbl.style.color = "white";
      lbl.style.margin = "0px 8px 0px 8px";

      // create input
      let input;
      if (this.config[option].type === "select") {
        input = document.createElement("select");
        input.style.width = "30%";
        input.style.padding = "8px";
        input.style.backgroundColor = "#aaaaaa";

        this.config[option].values.forEach((val) => {
          const opt = document.createElement("option");
          opt.value = val.toLowerCase();
          opt.textContent = val;
          input.appendChild(opt);
        });
      } else {
        input = document.createElement("input");
        input.value = this.config[option].defaultValue;
        input.type = this.config[option].type;
        input.style.width = "30%";
        input.style.backgroundColor = "#aaaaaa";
        input.style.padding = "8px";
        if (this.config[option].type === "checkbox") {
          input.checked = false;
        }
      }

      this.inputElements[option] = input;

      // create description (if present)
      let desc = null;
      if (this.config[option].description) {
        desc = document.createElement("p");
        desc.textContent = this.config[option].description;
        desc.style.width = "50%";
        desc.style.color = "#dddddd";
        desc.style.margin = "8px 0px 0px 16px";
      }

      // put wrapper together
      wrapper.appendChild(lbl);
      wrapper.appendChild(input);
      if (desc) wrapper.appendChild(desc);
      this.overlay.appendChild(wrapper);
    }
  }

  /**
   * Creates a form option dynamically
   * @param {string} label - The label text
   * @param {string} type - Input type ('text', 'checkbox', 'select', etc.)
   * @param {Array} values - Array of options (for select) or empty for others
   */
  createOption(label, type, defaultValue, values, description) {
    const wrapper = document.createElement("div");
    wrapper.style.margin = "4px";

    // create label
    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.style.color = "white";
    lbl.style.margin = "0px 8px 0px 8px";

    // create input
    let input;
    if (type === "select") {
      input = document.createElement("select");
      input.style.width = "10%";
      input.style.padding = "8px";

      values.forEach((val) => {
        const opt = document.createElement("option");
        opt.value = val.toLowerCase();
        opt.textContent = val;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement("input");
      input.value = defaultValue;
      input.type = type;
      input.style.width = "10%";
      input.style.padding = "8px";
      if (type === "checkbox") {
        input.checked = false;
      }
    }
    this.config[label] = input;

    // create description (if present)
    let desc = null;
    if (description) {
      desc = document.createElement("p");
      desc.textContent = description;
      desc.style.color = "white";
      desc.style.margin = "8px 0px 0px 16px";
    }

    // put wrapper together
    wrapper.appendChild(lbl);
    wrapper.appendChild(input);
    if (desc) wrapper.appendChild(desc);
    this.overlay.appendChild(wrapper);
  }

  _attachEventListeners() {
    // Attach the stored handler
    document.addEventListener("keydown", this.handleKeyDown);
  }

  _handleKeyDown(e) {
    const key = e.key.toLowerCase();

    if (this.isOpen) {
      if (key === "c" || key === "escape" || key === "o") {
        this.closeConfig();
      }
    } else if (!this.isOpen) {
      if (key === "c" || key === "escape" || key === "o") {
        this.openConfig();
      }
    }
  }

  openConfig() {
    this.overlay.style.display = "flex";
    this.isOpen = true;
  }

  closeConfig() {
    this.overlay.style.display = "none";
    this.isOpen = false;
  }

  /**
   * Cleanup method to remove listeners and DOM elements
   * Useful if the component is destroyed
   */
  destroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.overlay.removeEventListener("click", this._handleOverlayClick);
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.isOpen = false;
  }
}

// Usage Example:
// const config = new ConfigHandler();
// Later to clean up: config.destroy();
