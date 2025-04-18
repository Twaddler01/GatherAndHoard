import { updateGatherCount, gatherCounts, upgradeData } from './MainScene.js';
import { dataArray } from './tiledBoxes.js';

export default class GatherBar extends Phaser.GameObjects.Graphics {
    constructor(scene, title, x, y, points, up1_desc) {
        super(scene, title, { x, y });

        this.x = x;
        this.up1_desc = up1_desc;
        this.barId = title;
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
        //gatherCounts[title + '_auto'] = 0;
        //gatherCounts[title] = 0;
        this.counterKey = title;
        this.first_check = true;
        this.nextUpgrade = parseInt(localStorage.getItem(this.barId + '_nextUpgrade')) || 5;

        // Create a container to hold both the bar and the button
        this.container = this.scene.add.container(x, y); // Position of the container

        this.title = this.scene.add.text(x, this.height / 2, title, {
            font: '20px Arial',
            padding: { left: 10, right: 10 }
        });

        this.nextUpgradeTxt = this.scene.add.text(this.container.width + 190, this.height / 2, 'Next Req: ' + this.nextUpgrade, {
            font: '14px Arial',
            padding: { left: 10, right: 10 }
        });
        this.container.add(this.nextUpgradeTxt);

        // Create the gather button (to the left of the bar)
        this.gatherButton = this.scene.add.text(-35, this.height / 2 + 30, 'Gather', {
            font: '20px Arial',
            fill: '#ffffff',
            backgroundColor: '#008000',
            padding: { left: 10, right: 10 }
        })
        .setInteractive()
        .on('pointerdown', this.onTap, this); // Set button interaction

        this.upgradeInfo = this.scene.add.text(x, this.height / 2 + 55, 'Next Upgrade: ' + up1_desc, {
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
        
        if (this.nextUpgrade === 20) {
            this.totalPoints = 1;
            this.remainingPoints = 1;
            this.drawBar2();
            //this.checkUpgradeAvailability();
        } else {
            //this.upgradeIcon.destroy();
            //this.showUpgrade();
            //this.activatedUpgradeIcon(1);
        }
    }

    // Upgrade
    showUpgrade() {
        this.upgradeIconLocked = true; // Lock state until unlocked

        this.upgradeIcon = this.scene.add.image(this.container.width + 280, this.container.width + 60, 'upgradeIcon')
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
        this.bar.fillRect(50, 40, this.width, this.height);

        // Draw fill based on remaining points
        const fillWidth = (this.width * this.remainingPoints) / this.totalPoints;
        this.bar.fillStyle(this.fillColor, 1);
        this.bar.fillRect(50, 40, fillWidth, this.height);
    }
    
    drawBar2() {
        this.bar.clear();
        // Re-draw black background
        this.bar.fillStyle(0x4f4f4f, 1);
        this.bar.fillRect(50, 40, this.width, this.height);
        const up2_desc = 'Next Upgrade: Automatically gather +' + (gatherCounts[this.counterKey + '_auto'] + 1) + ' ' + this.counterKey + ' per second.';
        this.upgradeInfo.setText(up2_desc);
    }

    checkUpgradeAvailability() {        //console.log(this.nextUpgrade);
        // HP upgrade (5)
        if (gatherCounts[this.counterKey] >= this.nextUpgrade && this.upgradeIconLocked && this.totalPoints > 1 && this.nextUpgrade !== 20) {
            this.activatedUpgradeIcon(1);
        } else if (this.totalPoints <= 1 || this.nextUpgrade === 20) {
            this.nextUpgrade = 20;
localStorage.setItem(this.barId + '_nextUpgrade', this.nextUpgrade);
            this.nextUpgradeTxt.setText('Next Req: ' + this.nextUpgrade);
            const up2_desc = 'Next Upgrade: Automatically gather +' + (gatherCounts[this.counterKey + '_auto'] + 1) + ' ' + this.counterKey + ' per second.';
            this.upgradeInfo.setText(up2_desc);
            if (this.first_check) {
                this.bar.fillStyle(0x4f4f4f, 1);
                this.bar.fillRect(50, 40, this.width, this.height);
                this.first_check = false;
            }
        }
        
        // Auto-gather upgrade (20)
        if (gatherCounts[this.counterKey] >= this.nextUpgrade && this.upgradeIconLocked && this.totalPoints <= 1) {
            this.activatedUpgradeIcon(2);
        }

        // Upgrade tab availability (only for active upgrades)
        upgradeData
        .filter(upg => upg.available)
        .forEach(upg => {
            const id = `${upg.from}_to_${upg.to}`;
            // Upgrade data
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

        // Craft tab availability
        dataArray
        .filter(craft => craft.available)
        .forEach(craft => {
            const craftBtn = this.scene.craftdBoxes.getTileButton(craft.title);
            const craftReqLabel = this.scene.craftdBoxes.getTileColor(craft.title + '_lbl');
        
            if (craftBtn) {
                let allMet = true;
        
                craft.requirements.forEach((req, i) => {
                    const reqKey = `${req.id}_req_${i}`;
                    const costText = this.scene.craftdBoxes.getTileColor(reqKey);
                    const currentCount = gatherCounts[req.id] || 0;
        
                    if (currentCount >= req.count) { // TEST req.count <> 10
                        costText.setColor('#2ecc71');
                    } else {
                        costText.setColor('red');
                        allMet = false;
                    }
                });
        
                if (allMet) {
                    craftBtn.setBackgroundColor('#2ecc71');
                    if (craftReqLabel) craftReqLabel.setColor('#2ecc71');
                    // Main trigger
                    craft.canBuy = true;
                } else {
                    craftBtn.setBackgroundColor('#333');
                    if (craftReqLabel) craftReqLabel.setColor('red');
                    craft.canBuy = false;
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
                this.scene.inventory.updateInventory();
            }
            
            if (type === 2) {
                // Upgrade action
                gatherCounts[this.counterKey] -= 20;
                gatherCounts[this.counterKey + '_auto'] += 1;
                this.scene.inventory.updateInventory();

    
                // Create the autoText display
                if (!this.autoText) {
                    this.autoText = this.scene.add.text(this.x, this.height / 2 + 28, 'Auto: ' + gatherCounts[this.counterKey + '_auto'] + '/sec', {
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
                            this.scene.inventory.updateInventory();
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
                this.scene.inventory.updateInventory();

                this.remainingPoints = this.totalPoints;

                if (this.totalPoints > 1) {
                    // Start over
                    this.drawBar();
                } else {
                    // Redraw bar for nextUpgrade
                    this.drawBar2();
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