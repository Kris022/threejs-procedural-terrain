export default class Controls {
  constructor() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    this.#addKeyboardListeners();
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      if (event.key == "ArrowUp") {
        this.up = true;
      } else if (event.key == "ArrowDown") {
        this.down = true;
      } else if (event.key == "ArrowLeft") {
        this.left = true;
      } else if (event.key == "ArrowRight") {
        this.right = true;
      }
    };

    document.onkeyup = (event) => {
      if (event.key == "ArrowUp") {
        this.up = false;
      } else if (event.key == "ArrowDown") {
        this.down = false;
      } else if (event.key == "ArrowLeft") {
        this.left = false;
      } else if (event.key == "ArrowRight") {
        this.right = false;
      }
    };
  }
}
