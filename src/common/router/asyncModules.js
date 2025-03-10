const modulesFiles = import.meta.glob('@views/**/*.vue');

export const asyncRoutes = Object.entries(modulesFiles).reduce((routes, [url, importFn]) => {
  if (!/\/(login|components|app\/main|page404)/.test(url)) {
    let path = url.replace('/src/views', '');
    path = path.replace('.vue', '');
    routes.push({
      path,
      name: path,
      component: importFn,
    });
  }

  return routes;
}, []);
