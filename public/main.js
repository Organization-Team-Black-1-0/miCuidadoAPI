const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    "/": "/pages/home.html",
    "/register": "/pages/register.html",
    "/login": "/pages/login.html",
    "/recover": "/pages/recover.html",
    "/checkList": "/pages/checkList.html",
    404: "/pages/404.html"
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

