import { gatherCounts } from './MainScene.js';

// const inventory = new Inventory(this, 0, 0);

export default class Inventory {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.textObjects = {}; // store references to update later
        this.container = scene.add.container(x, y);

        this.setupInventory();
    }

    setupInventory() {
        const panelWidth = 300;
        const titleText = this.scene.add.text(10, 0, 'INVENTORY', {
            font: '18px Arial',
            color: '#ffffff'
        });
        this.container.add(titleText);
    
        let offsetY = 30;
    
        const col1X = 10;
        const col2X = panelWidth / 3;
        const col3X = (panelWidth / 3) * 2;
    
        for (const id in gatherCounts) {
            if (id.endsWith('_auto')) continue;

            const value = gatherCounts[id];
    
            const idText = this.scene.add.text(col1X, offsetY, id, {
                font: '16px Arial',
                color: '#ccc'
            });
    
            const valueText = this.scene.add.text(col2X, offsetY, value.toString(), {
                font: '16px Arial',
                color: '#ccc'
            });
    
            const gainText = this.scene.add.text(col3X, offsetY, '(+0/s)', {
                font: '16px Arial',
                color: '#66ff66'
            });
    
            this.container.add([idText, valueText, gainText]);
    
            this.textObjects[id] = {
                value: valueText,
                gain: gainText
            };
    
            offsetY += 24;
        }
    }

    updateInventory() {
        const panelWidth = 300;
        const col1X = 10;
        const col2X = panelWidth / 3;
        const col3X = panelWidth / 2;
        const rowHeight = 24;
    
        let index = 0;
    
        for (const id in gatherCounts) {
            if (id.endsWith('_auto')) continue;
    
            const value = gatherCounts[id];
            const gainRate = gatherCounts[id + '_auto'] ?? 0;
    
            const gainTextValue = gainRate === 0 ? '' : `${gainRate > 0 ? '+' : ''}${gainRate}/s`;
            const gainColor = gainRate < 0 ? '#ff6666' : '#66ff66';
    
            if (this.textObjects[id]) {
                this.textObjects[id].value.setText(value.toString());
    
                if (gainRate === 0) {
                    this.textObjects[id].gain.setText('');
                } else {
                    this.textObjects[id].gain.setText(gainTextValue);
                    this.textObjects[id].gain.setColor(gainColor);
                }
            } else {
                const offsetY = 30 + index * rowHeight;
    
                const idText = this.scene.add.text(col1X, offsetY, id, {
                    font: '16px Arial',
                    color: '#ccc'
                });
    
                const valueText = this.scene.add.text(col2X, offsetY, value.toString(), {
                    font: '16px Arial',
                    color: '#ccc'
                });
    
                const gainText = this.scene.add.text(col3X, offsetY, gainTextValue, {
                    font: '16px Arial',
                    color: gainColor
                });
    
                this.container.add([idText, valueText, gainText]);
    
                this.textObjects[id] = {
                    value: valueText,
                    gain: gainText
                };
    
                if (this.scene.scrollBox?.reflowElements) {
                    this.scene.scrollBox.reflowElements();
                }
            }
    
            index++;
        }
    }
}