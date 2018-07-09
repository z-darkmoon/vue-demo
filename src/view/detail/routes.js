const component = resolve => require(['./index.vue'], resolve);

export default[
    {
        path: '/detail',
        name: 'detail',
        component,
    }
]