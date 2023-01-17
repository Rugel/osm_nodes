
const root = document.getElementById('root')
root.innerHTML = '<h1>Generator tablicy węzłów z OSM</h1><input id="input" type="text"/><button id="ok">OK</button><div id="arr"></div>';
const arr = document.getElementById('arr');
document.getElementById("ok").addEventListener('click', getData);
let nodesIdTab = [];
let nodesTab = [];

function getData() {
    const idsData = document.getElementById("input").value;
    const tabData = idsData.split(' ');

    let nodeId;


    for (let i = 0; i < tabData.length; i++) {
        fetch(`https://www.openstreetmap.org/api/0.6/way/${tabData[i]}`)
            .then(res => res.text())
            .then(data => new window.DOMParser().parseFromString(data, "text/xml"))
            .then(xmlDoc => {
                let nodesCol = xmlDoc.getElementsByTagName('nd');

                for (let k = 0; k < nodesCol.length; k++) {
                    nodeId = nodesCol[k].getAttribute('ref');
                    fetch(`https://www.openstreetmap.org/api/0.6/node/${nodeId}`)
                        .then(response => response.text())
                        .then(dane => new window.DOMParser().parseFromString(dane, "text/xml"))
                        .then(xmldoc =>{let node = xmldoc.getElementsByTagName('node')[0];
                        let lat = node.getAttribute('lat');
                        let lon = node.getAttribute('lon');
                    
                        console.log(`[${lat}, ${lon}]`);
                        nodesTab.push(`[${lat}, ${lon}]`);
    
                    });
                        
                }
            });
    }

    console.log(nodesTab);
    arr.innerHTML = `<b>zestaw węzłów lini:</b><br/><br/>${nodesTab}`;
};











