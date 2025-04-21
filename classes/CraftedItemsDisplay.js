import { craftData } from '../craft.js';

export default class CraftedItemsDisplay {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.craftData = craftData;

        this.textObjects = {};
        this.container = scene.add.container(x, y);

        this.setupDisplay();
    }

    setupDisplay() {
        const panelWidth = 300;
        const titleText = this.scene.add.text(10, 0, 'CRAFTED ITEMS', {
            font: '18px Arial',
            color: '#ffffff'
        });
        this.container.add(titleText);

        let offsetY = 30;
        const col1X = 10;
        const col2X = panelWidth / 2;

        this.craftData.forEach(data => {
            if (!data.effect) return;

            data.effect.forEach(effect => {
                if (effect) { // > 0
                console.log(effect.id + ' / ' + effect.amt);
                    const idText = this.scene.add.text(col1X, offsetY, `${data.title}`, {
                        font: '16px Arial',
                        color: '#ccc'
                    });

                    const amtText = this.scene.add.text(col2X, offsetY, `x${effect.amt}`, {
                        font: '16px Arial',
                        color: '#ccc'
                    });

                    this.container.add([idText, amtText]);

                    this.textObjects[data.num] = {
                        value: amtText
                    };

                    offsetY += 24;
                }
            });
        });
    }

    updateCraftedItems() {
        const activeUpgrades = this.scene.craftBoxes.craftStore.getActiveUpgrades(this.craftData);
        activeUpgrades.forEach(upg => {
            console.log(`${upg.title} is active at level ${upg.amt}`);
        });

        if (activeUpgrades) {
            activeUpgrades.forEach(data => {
                if (!data.effect) return;
    
                data.effect.forEach(effect => {
                    if (effect.amt > 0 && this.textObjects[data.num]) {
                        this.textObjects[data.num].value.setText(`x${effect.amt}`);
                    }
                });
            });
        }
    }
}
