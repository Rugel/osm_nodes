const root = document.getElementById('root')
root.innerHTML = `<div id="header"><h1>Generator zestawu węzłów "geo" z OSM</h1><a href="https://www.openstreetmap.org/#map=10/50.7799/20.7947" target="blank">Mapy OSM</a><br/><input id="input" type="text" placeholder='id jednej lub kilku lini odzielonych spacjami'/><button id="ok">OK</button></div><div id="arr"></div>`;
const arr = document.getElementById('arr');
document.getElementById("ok").addEventListener('click', getData);
let nodesIdTab = [];
let nodesTab = [];
let stPoint = [];

function getData() {
    arr.innerHTML = `<br/><b>zestaw węzłów lini (kolejność pobierania z API): <br/><br/></b>`;
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

    fetch(`https://www.openstreetmap.org/api/0.6/way/${tabData[0]}`)
        .then(res => res.text())
        .then(data => new window.DOMParser().parseFromString(data, "text/xml"))
        .then(xmlDoc => {
            let pointCol = xmlDoc.getElementsByTagName('nd');
            let pointId = pointCol[0].getAttribute('ref');
            fetch(`https://www.openstreetmap.org/api/0.6/node/${pointId}`)
                .then(response => response.text())
                .then(dane => new window.DOMParser().parseFromString(dane, "text/xml"))
                .then(xmldoc => {
                    let pkt = xmldoc.getElementsByTagName('node')[0];
                    let lt = pkt.getAttribute('lat');
                    let ln = pkt.getAttribute('lon');
                    stPoint.push(lt);
                    stPoint.push(ln);
                })
        });

    setTimeout(() => {
        let filNodesTab = nodesTab.filter((item, index) => nodesTab.indexOf(item) === index);
        let twoDimTab = filNodesTab.map(function (row) { return row.split(",") });
        twoDimTab = twoDimTab.map(row => row.map(elem => parseFloat(elem)));
        stPoint = [parseFloat(stPoint[0]), parseFloat(stPoint[1])];
        let sortfun = (a, b) => {
            let distanceA = Math.sqrt(Math.abs((a[0] - stPoint[0]) * (a[0] - stPoint[0]) + (a[1] - stPoint[1]) * (a[1] - stPoint[1])));
            let distanceB = Math.sqrt(Math.abs((b[0] - stPoint[0]) * (b[0] - stPoint[0]) + (b[1] - stPoint[1]) * (b[1] - stPoint[1])));
            return distanceA - distanceB
        };
        let sortTab = twoDimTab.sort(sortfun);
        arr.innerHTML += `<br/><br/>posortowany zestaw węzłów lini:<br/><br/>`;
        for (let m = 0; m < sortTab.length; m++) {
            m != sortTab.length - 1 ? arr.innerHTML += `[${sortTab[m]}], ` : arr.innerHTML += `[${sortTab[m]}]`
        }
    }, 5000);
};












