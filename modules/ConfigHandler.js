import config from "../config.json" assert { type: "json" };

class InputElement {
  constructor(inputType, defaultValue, selectValues) {
    if (inputType === "select") {
      this.input = document.createElement("select");
      this.input.style.width = "30%";
      this.input.style.padding = "8px";
      this.input.style.backgroundColor = "#aaaaaa";

      selectValues.forEach((val) => {
        const opt = document.createElement("option");
        opt.value = val.toLowerCase();
        opt.textContent = val;
        this.input.appendChild(opt);
      });
    } else {
      this.input = document.createElement("input");
      this.input.value = defaultValue;
      this.input.type = inputType;
      this.input.style.width = "30%";
      this.input.style.backgroundColor = "#aaaaaa";
      this.input.style.padding = "8px";
      if (inputType === "checkbox") {
        this.input.checked = false;
      }
    }

    this.get = () => this.input.value;
  }

  set onchange(func) {
    this.input.onchange = func;
  }

  setDataType(dataType) {
    if (dataType == "float") this.get = () => parseFloat(this.input.value);
    if (dataType == "int") this.get = () => parseInt(this.input.value);
    return;
  }
}

export class ConfigHandler {
  constructor() {
    this.isOpen = false;
    this.config = config;
    this.inputElements = {};

    this.overlay = null;
    this.panel = null;
    this.closeBtn = null;
    this.clearBtn = null;
    this.handleKeyDown = this._handleKeyDown.bind(this);

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
      this.createOption(
        option,
        this.config[option].inputLabel,
        this.config[option].inputType,
        this.config[option].dataType,
        this.config[option].defaultValue,
        this.config[option].selectValues,
        this.config[option].description,
      );
    }
  }

  _createInputLabel(inputLabel) {
    const lbl = document.createElement("label");
    lbl.textContent = inputLabel;
    lbl.style.fontSize = "20px";
    lbl.style.color = "white";
    lbl.style.margin = "0px 8px 0px 8px";
    return lbl;
  }

  _createInput(inputType, defaultValue, selectValues) {
    let input;

    if (inputType === "select") {
      input = document.createElement("select");
      input.style.width = "30%";
      input.style.padding = "8px";
      input.style.backgroundColor = "#aaaaaa";

      selectValues.forEach((val) => {
        const opt = document.createElement("option");
        opt.value = val.toLowerCase();
        opt.textContent = val;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement("input");
      input.value = defaultValue;
      input.type = inputType;
      input.style.width = "30%";
      input.style.backgroundColor = "#aaaaaa";
      input.style.padding = "8px";
      if (inputType === "checkbox") {
        input.checked = false;
      }
    }
    return input;
  }

  _createInputDescription(description) {
    const desc = document.createElement("p");
    desc.textContent = description;
    desc.style.width = "50%";
    desc.style.color = "#dddddd";
    desc.style.margin = "8px 0px 0px 16px";
    return desc;
  }

  _storeInputElement(input, name) {
    this.inputElements[name] = input;
  }

  createOption(
    name,
    inputLabel,
    inputType,
    dataType,
    defaultValue,
    selectValues,
    description,
  ) {
    const wrapper = document.createElement("div");
    wrapper.style.margin = "4px";

    const lbl = this._createInputLabel(inputLabel);
    const input = new InputElement(inputType, defaultValue, selectValues);
    input.setDataType(dataType);
    this.inputElements[name] = input;

    let desc = null;
    if (description) desc = this._createInputDescription(description);

    // put wrapper together
    wrapper.appendChild(lbl);
    wrapper.appendChild(input.input);
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

  destroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.overlay.removeEventListener("click", this._handleOverlayClick);
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.isOpen = false;
  }
}
