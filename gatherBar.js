import { gatherCounts } from './MainScene.js';

export default class GatherBar extends Phaser.GameObjects.Graphics {
    constructor(scene, title, x, y, points) {
        super(scene, title, { x, y });

        this.title = title;
        this.scene = scene;
        this.totalPoints = points; // Total points
        this.remainingPoints = points; // Points left
        this.width = 200; // Width of the bar
        this.height = 30; // Height of the bar
        this.backgroundColor = 0x000000; // Background color of the bar (black)
        this.fillColor = 0x00FF00; // Fill color (green)
        this.buttonSpacing = 10; // Spacing between the bar and the button

        // Variables
        gatherCounts[title] = 0;
        this.counterKey = title;

        // Create a container to hold both the bar and the button
        this.container = this.scene.add.container(x, y); // Position of the container

        this.title = this.scene.add.text(x, this.height / 2 - 40, title + ': ', {
            font: '20px Arial',
            padding: { left: 10, right: 10 }
        });
        
        // Create counter text
        this.gatheredText = this.scene.add.text(x + 120, this.height / 2 - 40, '0', {
            font: '20px Arial',
            padding: { left: 10, right: 10 }
        });
        this.container.add(this.gatheredText);

        // Create the gather button (to the left of the bar)
        this.gatherButton = this.scene.add.text(-35, this.height / 2 - 10, 'Gather', {
            font: '20px Arial',
            fill: '#ffffff',
            backgroundColor: '#008000',
            padding: { left: 10, right: 10 }
        })
        .setInteractive()
        .on('pointerdown', this.onTap, this); // Set button interaction

        // Create the gather bar inside the container
        this.bar = this.scene.add.graphics();
        this.container.add(this.title);
        this.container.add(this.bar);
        this.container.add(this.gatherButton); // Add the button to the container

        // Draw the bar when it is created
        this.drawBar();

        // Upgrade
        this.showUpgrade();
        
        // Add this container to the scene
        this.scene.add.existing(this.container);
    }

    //// Upgrade
    showUpgrade() {
        this.upgradeIconLocked = true; // Lock state until unlocked

        this.upgradeIcon = this.scene.add.image(this.container.width + 280, this.container.width + 15, 'upgradeIcon')
            .setScale(0.0615) // Resize to 50x50
            .setOrigin(0) // Optional: top-left origin
            .setTint(0x808080) // Gray tint
            .setOrigin(0.5);
        this.container.add(this.upgradeIcon); // Add the button to the container

//this.upgradeIcon.clearTint(); // Restores full color

    }

    drawBar() {
        // Clear previous drawings
        this.bar.clear();

        // Draw background
        this.bar.fillStyle(this.backgroundColor, 1);
        this.bar.fillRect(50, 0, this.width, this.height);

        // Draw fill based on remaining points
        const fillWidth = (this.width * this.remainingPoints) / this.totalPoints;
        this.bar.fillStyle(this.fillColor, 1);
        this.bar.fillRect(50, 0, fillWidth, this.height);
    }

    checkUpgradeAvailability() {
        if (gatherCounts[this.counterKey] >= 5 && this.upgradeIconLocked) {
            if (this.totalPoints <= 1) {
                return;
            }
            
            this.upgradeIconLocked = false;
    
            // Remove tint to show it's active
            this.upgradeIcon.clearTint();
    
            // Add pulsing effect
            this.upgradeTween = this.scene.tweens.add({
                targets: this.upgradeIcon,
                scale: { from: 0.0615, to: 0.07 },
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
    
            // Make it interactive
            this.upgradeIcon.setInteractive().on('pointerdown', () => {
                console.log('Upgrade clicked!');
                // Remove tween 
                if (this.upgradeTween) {
                    this.upgradeTween.stop();
                    this.upgradeTween.destroy();
                    this.upgradeTween = null;
                }                
                this.upgradeIcon.setTint(0x808080);
                gatherCounts[this.counterKey] -= 5;
                this.gatheredText.setText(gatherCounts[this.counterKey]);

                // Apply upgrade
                this.totalPoints -= 1;
                
                this.upgradeIcon.destroy();
                this.showUpgrade();
                
                this.checkUpgradeAvailability();
            });

        }
    }

    onTap() {
        if (this.remainingPoints > 0) {
            // Decrease the points by 1 on tap
            this.remainingPoints -= 1;
            this.drawBar(); // Redraw the bar with the new value

            // If the bar reaches 0, log the collection of a Twig
            if (this.remainingPoints === 0) {
                //console.log("You gathered a Twig!");
                // Optionally, handle your inventory update here
                // For example, increment twig count:
                // this.scene.inventory.addTwig();

                gatherCounts[this.counterKey]++;
                this.gatheredText.setText(gatherCounts[this.counterKey]);

                // Start over
                this.remainingPoints = this.totalPoints;
                this.drawBar();
                
                // Check if upgrade should be unlocked
                this.checkUpgradeAvailability();

            }
        }
    }
}