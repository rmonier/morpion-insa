fetch("header.html").then(res => { document.querySelector("header").innerHTML = res; });
fetch("footer.html").then(res => { document.querySelector("footer").innerHTML = res; });