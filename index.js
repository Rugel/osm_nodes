

document.getElementById('root').innerHTML = '<h1>Generator tablicy węzłów z OSM</h1><input id="input" type="text"/><button id="ok">OK</button>';
document.getElementById("ok").addEventListener('click', getData);
function getData() {
    const idsData = document.getElementById("input").value;
    const tabData = idsData.split(' ');
    const tabOfNodes = [];
    let nodesTab = [];
    let nodeId;

    for (let i = 0; i < tabData.length; i++) {

        fetch(`https://www.openstreetmap.org/api/0.6/way/${tabData[i]}`)
            .then(res => res.text())
            .then(data => new window.DOMParser().parseFromString(data, "text/xml"))
            .then(xmlDoc => {
            let nodesCol = xmlDoc.getElementsByTagName('nd');

            for (let k = 0; k < nodesCol.length; k++) {
                nodeId = nodesCol[k].getAttribute('ref');
                nodesTab.push(nodeId);
            }

           
            console.log(nodesTab);
                });
            }
                
            };
    










