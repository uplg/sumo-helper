// Twitch Extension Trajectory Calculator for Sumo by @s17n

class TwitchTrajectoryCalculator {
  private isDragging: boolean = false;
  private isDraggingCircle: boolean = false;
  private dragOffset: { x: number; y: number } = { x: 0, y: 0 };
  private currentAngle: number = 0;
  private readonly radius: number = 100;
  private readonly centerX: number = 150;
  private readonly centerY: number = 150;
  private pointX: number;
  private pointY: number;

  private container!: HTMLDivElement;
  private point!: SVGCircleElement;
  private radiusLine!: SVGLineElement;
  private angleText!: SVGTextElement;
  private toggleButton!: HTMLButtonElement;

  constructor() {
    this.pointX = this.centerX + this.radius;
    this.pointY = this.centerY;
    this.init();
  }

  private init(): void {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.createInterface();
        this.createToggleButton();
      });
    } else {
      this.createInterface();
      this.createToggleButton();
    }
  }

  private createInterface(): void {
    this.container = document.createElement("div");
    this.container.id = "trajectory-calculator";
    this.container.classList.add("trajectory-calculator-hidden");

    Object.assign(this.container.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "300px",
      height: "300px",
      background: "transparent",
      border: "none",
      zIndex: "10000",
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      fontSize: "12px",
      cursor: "grab",
      userSelect: "none",
    });

    this.createCircle();
    this.applyStyles();

    document.body.appendChild(this.container);

    this.addEventListeners();
    this.addKeyboardShortcut();
  }

  private createToggleButton(): void {
    this.toggleButton = document.createElement("button");
    this.toggleButton.id = "trajectory-toggle";
    this.toggleButton.textContent = "T";
    this.toggleButton.title = "Toggle Trajectory Calculator (T)";

    Object.assign(this.toggleButton.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "rgba(26, 32, 44, 0.95)",
      color: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "8px",
      padding: "8px 12px",
      cursor: "pointer",
      fontSize: "12px",
      zIndex: "10001",
      transition: "all 0.2s ease",
    });

    this.toggleButton.addEventListener("click", () => {
      this.toggle();
    });

    this.toggleButton.addEventListener("mouseenter", () => {
      this.toggleButton.style.background = "rgba(26, 32, 44, 1)";
      this.toggleButton.style.borderColor = "rgba(255, 255, 255, 0.4)";
    });

    this.toggleButton.addEventListener("mouseleave", () => {
      this.toggleButton.style.background = "rgba(26, 32, 44, 0.95)";
      this.toggleButton.style.borderColor = "rgba(255, 255, 255, 0.2)";
    });

    document.body.appendChild(this.toggleButton);
  }

  private toggle(): void {
    if (this.container.classList.contains("trajectory-calculator-hidden")) {
      this.container.classList.remove("trajectory-calculator-hidden");
    } else {
      this.container.classList.add("trajectory-calculator-hidden");
    }
  }

  private addKeyboardShortcut(): void {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "t" || e.key === "T") {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.getAttribute("contenteditable") === "true")
        ) {
          return;
        }
        this.toggle();
        e.preventDefault();
      }
    });
  }

  private createCircle(): void {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "300");
    svg.setAttribute("height", "300");
    svg.classList.add("trajectory-circle");

    Object.assign(svg.style, {
      position: "relative",
      width: "100%",
      height: "100%",
      cursor: "grab",
      userSelect: "none",
    });

    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", this.centerX.toString());
    circle.setAttribute("cy", this.centerY.toString());
    circle.setAttribute("r", this.radius.toString());
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#9146ff");
    circle.setAttribute("stroke-width", "2");

    const axisX = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    axisX.setAttribute("x1", "50");
    axisX.setAttribute("y1", this.centerY.toString());
    axisX.setAttribute("x2", "250");
    axisX.setAttribute("y2", this.centerY.toString());
    axisX.setAttribute("stroke", "#666");
    axisX.setAttribute("stroke-width", "1");

    const axisY = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    axisY.setAttribute("x1", this.centerX.toString());
    axisY.setAttribute("y1", "50");
    axisY.setAttribute("x2", this.centerX.toString());
    axisY.setAttribute("y2", "250");
    axisY.setAttribute("stroke", "#666");
    axisY.setAttribute("stroke-width", "1");

    this.point = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.point.setAttribute("cx", this.pointX.toString());
    this.point.setAttribute("cy", this.pointY.toString());
    this.point.setAttribute("r", "8");
    this.point.setAttribute("fill", "#ff6b6b");
    this.point.setAttribute("stroke", "#fff");
    this.point.setAttribute("stroke-width", "2");
    this.point.style.cursor = "grab";
    this.point.style.userSelect = "none";

    this.radiusLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    this.radiusLine.setAttribute("x1", this.centerX.toString());
    this.radiusLine.setAttribute("y1", this.centerY.toString());
    this.radiusLine.setAttribute("x2", this.pointX.toString());
    this.radiusLine.setAttribute("y2", this.pointY.toString());
    this.radiusLine.setAttribute("stroke", "#ff6b6b");
    this.radiusLine.setAttribute("stroke-width", "2");

    this.angleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    this.angleText.setAttribute("x", (this.pointX + 10).toString());
    this.angleText.setAttribute("y", (this.pointY - 10).toString());
    this.angleText.setAttribute("fill", "#ff6b6b");
    this.angleText.setAttribute("font-size", "12");
    this.angleText.setAttribute("font-weight", "bold");
    this.angleText.style.userSelect = "none";
    this.angleText.textContent = "0°";

    this.createAngleMarkers(svg);

    svg.appendChild(circle);
    svg.appendChild(axisX);
    svg.appendChild(axisY);
    svg.appendChild(this.radiusLine);
    svg.appendChild(this.point);
    svg.appendChild(this.angleText);

    this.container.appendChild(svg);
  }

  private createAngleMarkers(svg: SVGSVGElement): void {
    const angles = [
      0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330,
    ];

    angles.forEach((angle) => {
      const radian = (angle * Math.PI) / 180;
      const x = this.centerX + (this.radius + 15) * Math.cos(radian);
      const y = this.centerY - (this.radius + 15) * Math.sin(radian);

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", x.toString());
      text.setAttribute("y", y.toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", "#FFF");
      text.setAttribute("font-size", "10");
      text.textContent = angle + "°";

      svg.appendChild(text);
    });
  }

  private applyStyles(): void {
    const hiddenStyle = document.createElement("style");
    hiddenStyle.textContent = `
      .trajectory-calculator-hidden {
        display: none !important;
      }
      .trajectory-calculator:active {
        cursor: grabbing !important;
      }
      .trajectory-circle:active {
        cursor: grabbing !important;
      }
    `;
    document.head.appendChild(hiddenStyle);
  }

  private addEventListeners(): void {
    this.point.addEventListener("mousedown", (e: MouseEvent) => {
      this.isDragging = true;
      this.point.style.cursor = "grabbing";
      e.preventDefault();
      e.stopPropagation();
    });

    const svgElement = this.container.querySelector(
      ".trajectory-circle"
    ) as SVGSVGElement;
    if (svgElement) {
      svgElement.addEventListener("mousedown", (e: MouseEvent) => {
        if (e.target === this.point) return;

        this.isDraggingCircle = true;
        const containerRect = this.container.getBoundingClientRect();

        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;

        this.dragOffset = {
          x: e.clientX - centerX,
          y: e.clientY - centerY,
        };
        svgElement.style.cursor = "grabbing";
        e.preventDefault();
      });
    }

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.isDragging) {
        this.updatePointPosition(e);
      } else if (this.isDraggingCircle) {
        this.moveCircle(e);
      }
    });

    document.addEventListener("mouseup", () => {
      this.isDragging = false;
      this.isDraggingCircle = false;
      this.point.style.cursor = "grab";
      const svgElement = this.container.querySelector(
        ".trajectory-circle"
      ) as SVGSVGElement;
      if (svgElement) {
        svgElement.style.cursor = "grab";
      }
    });
  }

  private updatePointPosition(e: MouseEvent): void {
    const rect = this.container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const deltaX = mouseX - this.centerX;
    const deltaY = this.centerY - mouseY;

    this.currentAngle = Math.atan2(deltaY, deltaX);

    this.pointX = this.centerX + this.radius * Math.cos(this.currentAngle);
    this.pointY = this.centerY - this.radius * Math.sin(this.currentAngle);

    this.point.setAttribute("cx", this.pointX.toString());
    this.point.setAttribute("cy", this.pointY.toString());
    this.radiusLine.setAttribute("x2", this.pointX.toString());
    this.radiusLine.setAttribute("y2", this.pointY.toString());

    this.angleText.setAttribute("x", (this.pointX + 15).toString());
    this.angleText.setAttribute("y", (this.pointY - 10).toString());

    this.updateValues();
  }

  private moveCircle(e: MouseEvent): void {
    const newX = e.clientX - this.dragOffset.x;
    const newY = e.clientY - this.dragOffset.y;

    this.container.style.left = newX + "px";
    this.container.style.top = newY + "px";
  }

  private updateValues(): void {
    const angleDegrees = ((this.currentAngle * 180) / Math.PI + 360) % 360;

    this.angleText.textContent = angleDegrees.toFixed(1) + "°";
  }
}

new TwitchTrajectoryCalculator();
