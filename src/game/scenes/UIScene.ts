// src/game/scenes/UIScene.ts
import Phaser from "phaser";

export class UIScene extends Phaser.Scene {
  private scoreText: Phaser.GameObjects.Text | null = null;
  private scoreLabel: Phaser.GameObjects.Text | null = null;
  private restartButton: Phaser.GameObjects.Container | null = null;
  private overlayContainer: Phaser.GameObjects.Container | null = null;
  private currentScore: number = 0;

  constructor() {
    super({ key: "UIScene" });
  }

  create(): void {
    this.drawScore();
    this.drawRestartButton();
    this.setupEvents();
    this.scale.on("resize", this.handleResize, this);
  }

  private drawScore(): void {
    this.scoreLabel = this.add.text(0, 0, "SCORE", {
      fontSize: "14px",
      fontFamily: "Arial, sans-serif",
      fontStyle: "bold",
      color: "#776e65",
    });
    this.scoreLabel.setOrigin(0, 0.5);

    this.scoreText = this.add.text(0, 0, "0", {
      fontSize: "28px",
      fontFamily: "Arial, sans-serif",
      fontStyle: "bold",
      color: "#776e65",
    });
    this.scoreText.setOrigin(0, 0.5);

    this.positionScore();
  }

  private positionScore(): void {
    if (!this.scoreLabel || !this.scoreText) return;
    const x = this.scale.width / 2 - 40;
    const y = 40;
    this.scoreLabel.setPosition(x, y - 15);
    this.scoreText.setPosition(x, y + 10);
  }

  private drawRestartButton(): void {
    const x = this.scale.width - 50;
    const y = 40;

    const bg = this.add.rectangle(0, 0, 44, 44, 0x8f7a66);
    bg.setInteractive({ useHandCursor: true });

    const icon = this.add.text(0, 0, "\u21BA", {
      fontSize: "22px",
      fontFamily: "Arial, sans-serif",
      color: "#f9f6f2",
    });
    icon.setOrigin(0.5, 0.5);

    this.restartButton = this.add.container(x, y, [bg, icon]);
    this.restartButton.setDepth(10);

    bg.on("pointerdown", () => {
      this.hideOverlay();
      const gameScene = this.scene.get("GameScene");
      gameScene.events.emit("restart");
    });

    bg.on("pointerover", () => {
      bg.setFillStyle(0x9f8b77);
    });

    bg.on("pointerout", () => {
      bg.setFillStyle(0x8f7a66);
    });
  }

  private setupEvents(): void {
    const gameScene = this.scene.get("GameScene");

    gameScene.events.on("scoreUpdate", (score: number) => {
      this.currentScore = score;
      if (this.scoreText) {
        this.scoreText.setText(String(score));
        this.tweens.add({
          targets: this.scoreText,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 50,
          yoyo: true,
          ease: "Power1",
        });
      }
    });

    gameScene.events.on("gameWon", () => {
      this.showOverlay("You Win!", "Play Again");
    });

    gameScene.events.on("gameOver", () => {
      this.showOverlay("Game Over", "Try Again");
    });
  }

  private showOverlay(title: string, buttonText: string): void {
    if (this.overlayContainer) return;

    const width = this.scale.width;
    const height = this.scale.height;

    const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.5);
    bg.setOrigin(0, 0);
    bg.setInteractive();

    const titleText = this.add.text(width / 2, height / 2 - 40, title, {
      fontSize: "48px",
      fontFamily: "Arial, sans-serif",
      fontStyle: "bold",
      color: "#f9f6f2",
    });
    titleText.setOrigin(0.5, 0.5);

    const btnBg = this.add.rectangle(0, 0, 160, 50, 0x8f7a66);
    btnBg.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(0, 0, buttonText, {
      fontSize: "20px",
      fontFamily: "Arial, sans-serif",
      fontStyle: "bold",
      color: "#f9f6f2",
    });
    btnText.setOrigin(0.5, 0.5);

    const button = this.add.container(width / 2, height / 2 + 30, [btnBg, btnText]);

    btnBg.on("pointerdown", () => {
      this.hideOverlay();
      const gameScene = this.scene.get("GameScene");
      gameScene.events.emit("restart");
    });

    btnBg.on("pointerover", () => {
      btnBg.setFillStyle(0x9f8b77);
    });

    btnBg.on("pointerout", () => {
      btnBg.setFillStyle(0x8f7a66);
    });

    this.overlayContainer = this.add.container(0, 0, [bg, titleText, button]);
    this.overlayContainer.setDepth(20);
  }

  private hideOverlay(): void {
    if (this.overlayContainer) {
      this.overlayContainer.destroy(true);
      this.overlayContainer = null;
    }
  }

  private handleResize(): void {
    this.positionScore();
    if (this.restartButton) {
      this.restartButton.setPosition(this.scale.width - 50, 40);
    }
    this.hideOverlay();
  }
}
