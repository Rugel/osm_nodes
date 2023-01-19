
const root = document.getElementById('root')
root.innerHTML = `<div id="header"><h1>Generator zestawu węzłów "geo" z OSM</h1><a href="https://www.openstreetmap.org/#map=10/50.7799/20.7947" target="blank">Mapy OSM</a><br/><input id="input" type="text" placeholder='id jednej lub kilku lini odzielonych spacjami'/><input id="point" type="text" placeholder='współrzędne punktu według którego będą sortowane koordynaty (np. "52.3647888 22.4642777" - dwie liczby oddzielone jedynie spacją)'/><br/><button id="ok">OK</button></div><div id="arr"></div>`;
const arr = document.getElementById('arr');
document.getElementById("ok").addEventListener('click', getData);
let nodesIdTab = [];
let nodesTab = [];
let stPoint = {lat:0.0, lon:0.0};

function getData() {
    arr.innerHTML = `<br/><b>zestaw węzłów lini w losowej kolejności: <br/><br/></b>`;
    const idsData = document.getElementById("input").value;
    const pointV = document.getElementById('point').value;
    const pTab = pointV.split(" ");
    stPoint = {lat:pTab[0], lon:pTab[1]};
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
      arr.innerHTML += `<br/><br/>posortowany zestaw węzłów względem punktu "${stPoint.lat}, ${stPoint.lon}":<br/><br/>`
      for(let m=0; m<sortTab.length; m++){
        arr.innerHTML += `[${sortTab[m]}], `}
    }, 5000);
};












