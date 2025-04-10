import { gatherCounts, upgradeData } from './MainScene.js';

export default class GatherBar extends Phaser.GameObjects.Graphics {
    constructor(scene, title, x, y, points, up1_desc) {
        super(scene, title, { x, y });

        this.x = x;
        this.up1_desc = up1_desc;
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
        gatherCounts[title + '_auto'] = 0;
        gatherCounts[title] = 0;
        this.counterKey = title;
        this.first_check = true;
        
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

        this.upgradeInfo = this.scene.add.text(x, this.height / 2 + 15, 'Next Upgrade: ' + up1_desc, {
            font: '14px Arial',
            wordWrap: { width: this.width },
            padding: { left: 10, right: 10 }
        });

        // Create the gather bar inside the container
        this.bar = this.scene.add.graphics();
        this.container.add(this.title);
        this.container.add(this.bar);
        this.container.add(this.gatherButton); // Add the button to the container
        this.container.add(this.upgradeInfo);

        // Draw the bar when it is created
        this.drawBar();

        // Upgrade
        this.showUpgrade();
        
        // Add this container to the scene
        this.scene.add.existing(this.container);
    }

    // Upgrade
    showUpgrade() {
        this.upgradeIconLocked = true; // Lock state until unlocked

        this.upgradeIcon = this.scene.add.image(this.container.width + 280, this.container.width + 15, 'upgradeIcon')
            .setScale(0.0615) // Resize to 50x50
            .setOrigin(0) // Optional: top-left origin
            .setTint(0x808080) // Gray tint
            .setOrigin(0.5);
        this.container.add(this.upgradeIcon); // Add the button to the container
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
        // HP upgrade (5)
        if (gatherCounts[this.counterKey] >= 5 && this.upgradeIconLocked && this.totalPoints > 1) {
            this.activatedUpgradeIcon(1);
        } else if (this.totalPoints <= 1) {
            const up2_desc = 'Next Upgrade: Automatically gather +' + (gatherCounts[this.counterKey + '_auto'] + 1) + ' ' + this.counterKey + ' per second.';
            this.upgradeInfo.setText(up2_desc);
            if (this.first_check) {
                this.bar.fillStyle(0x4f4f4f, 1);
                this.bar.fillRect(50, 0, this.width, this.height);
                this.first_check = false;
            }
        }
        
        // Auto-gather upgrade (20)
        if (gatherCounts[this.counterKey] >= 20 && this.upgradeIconLocked && this.totalPoints <= 1) {
            this.activatedUpgradeIcon(2);
        }

        // Upgrade tab availability (only for active upgrades)
        upgradeData
        .filter(upg => upg.available)
        .forEach(upg => {
            const id = `${upg.from}_to_${upg.to}`;
            const upgradeBtn = this.scene.upgrade.getUpgradeButton(id);
            const upgradeReq = this.scene.upgrade.getUpgradeText(id + '_req');
            const upgradeCost = this.scene.upgrade.getUpgradeText(id + '_cost');
            const currentCount = gatherCounts[upg.req_id] || 0;
    
            if (upgradeBtn) {
                if (currentCount >= upg.req_cnt) {
                    upgradeBtn.setBackgroundColor('#2ecc71'); // green
                    upgradeReq.setColor('#2ecc71');
                    upgradeCost.setColor('#2ecc71');
                    
                } else {
                    upgradeBtn.setBackgroundColor('#333'); // default
                    upgradeReq.setColor('red');
                    upgradeCost.setColor('red');
                }
            }
        });
    }

    activatedUpgradeIcon(type) {
    
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
            // Remove tween 
            if (this.upgradeTween) {
                this.upgradeTween.stop();
                this.upgradeTween.destroy();
                this.upgradeTween = null;
            }        
            this.upgradeIcon.setTint(0x808080);
            
            if (type === 1) {
                // Upgrade action
                this.totalPoints -= 1;
               
                gatherCounts[this.counterKey] -= 5;
                this.gatheredText.setText(gatherCounts[this.counterKey]);
            }
            
            if (type === 2) {
                // Upgrade action
                gatherCounts[this.counterKey] -= 20;
                this.gatheredText.setText(gatherCounts[this.counterKey]);
                gatherCounts[this.counterKey + '_auto'] += 1;
    
                // Create the autoText display
                if (!this.autoText) {
                    this.autoText = this.scene.add.text(this.x, this.height / 2 - 40 + 30, 'Auto: ' + gatherCounts[this.counterKey + '_auto'] + '/sec', {
                        font: '20px Arial',
                        padding: { left: 10, right: 10 }
                    });
                    this.container.add(this.autoText);
                } else {
                    this.autoText.setText('Auto: ' + gatherCounts[this.counterKey + '_auto'] + '/sec');
                }
                // Start auto-gathering if not already started
                if (!this.autoGatherInterval) {
                    this.autoGatherInterval = this.scene.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            gatherCounts[this.counterKey] += gatherCounts[this.counterKey + '_auto'];
                            this.gatheredText.setText(gatherCounts[this.counterKey]);
                            this.checkUpgradeAvailability();
                        },
                        callbackScope: this,
                        loop: true
                    });
                }
            }
            
            this.upgradeIcon.destroy();
            this.showUpgrade();
            
            this.checkUpgradeAvailability();
        });
    }

    onTap() {
        if (this.remainingPoints > 0) {
            // Decrease the points by 1 on tap
            this.remainingPoints -= 1;
                                
            if (this.first_check) {
                this.drawBar(); 
            }

            // If the bar reaches 0, log the collection of a Twig
            if (this.remainingPoints === 0) {

                gatherCounts[this.counterKey]++;
                this.gatheredText.setText(gatherCounts[this.counterKey]);

                this.remainingPoints = this.totalPoints;

                if (this.totalPoints > 1) {
                    // Start over
                    this.drawBar();
                } else {
                    this.bar.clear();
                    // Re-draw black background
                    this.bar.fillStyle(0x4f4f4f, 1);
                    this.bar.fillRect(50, 0, this.width, this.height);
                    const up2_desc = 'Next Upgrade: Automatically gather +' + (gatherCounts[this.counterKey + '_auto'] + 1) + ' ' + this.counterKey + ' per second.';
                    this.upgradeInfo.setText(up2_desc);
                }
                
                // Check if upgrade should be unlocked
                this.checkUpgradeAvailability();

            }
        }
    }

    destroy() {
        if (this.autoGatherInterval) {
            this.autoGatherInterval.remove(); // Remove the timer
            this.autoGatherInterval = null;
        }
    
        // Clean up visuals
        this.container.destroy(true); // true = destroy all children
    }
}