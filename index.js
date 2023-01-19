
const root = document.getElementById('root')
root.innerHTML = '<h1>Generator zestawu węzłów "geo" z OSM</h1><input id="input" type="text"/><button id="ok">OK</button><div id="arr"></div>';
const arr = document.getElementById('arr');
document.getElementById("ok").addEventListener('click', getData);
let nodesIdTab = [];
let nodesTab = [];
const stPoint = {lat:52.1421189, lon:22.2503961};

function getData() {
    arr.innerHTML = `<br/><b>zestaw węzłów lini: <br/></b>`;
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
                        .then(xmldoc => {
                            let node = xmldoc.getElementsByTagName('node')[0];
                            let lat = node.getAttribute('lat');
                            let lon = node.getAttribute('lon');
                            nodesTab.push(`${lat}, ${lon}`);
                            arr.innerHTML += `[${lat}, ${lon}], `;
                        });
                }

            });
    }
    setTimeout(() => {
        let filNodesTab = nodesTab.filter((item, index) => nodesTab.indexOf(item) === index);
        let twoDimTab = filNodesTab.map(function(row){return row.split(",")});
        twoDimTab = twoDimTab.map(row => row.map(elem => parseFloat(elem)));
        let sortfun = (a, b) =>{let distanceA = Math.sqrt(Math.abs((a[0]-stPoint.lat) * (a[0]-stPoint.lat) + (a[1]-stPoint.lon) * (a[1]-stPoint.lon)));
                                let distanceB = Math.sqrt(Math.abs((b[0]-stPoint.lat) * (b[0]-stPoint.lat) + (b[1]-stPoint.lon) * (b[1]-stPoint.lon)));
                            return  distanceA - distanceB};
      let sortTab = twoDimTab.sort(sortfun);
      arr.innerHTML += `<br/><br/>posortowana tablica węzłów:<br/>`
      for(let m=0; m<sortTab.length; m++){
        arr.innerHTML += `[${sortTab[m]}], `}
    }, 5000);
};












