'use strict';
/// <reference path="typings/tds.d.ts"/>

import assert = require('assert');

import Confinger = require("../Confinger");

describe("Confinger", () => {
    describe("#add", () => {
        it("load 1 props set", () => {
            const configs = new Confinger();
            configs.add({
                a: 1,
                b: 2,
                c: 3
            });

            assert.equal((<any>configs)._props['a'], 1);
            assert.equal((<any>configs)._props['b'], 2);
            assert.equal((<any>configs)._props['c'], 3);
        });

        it("load 2 props set", () => {
            const configs = new Confinger();
            configs
                .add({
                    a: 1,
                    b: 2,
                    c: 3
                })
                .add({
                    d: 4,
                    e: 5,
                    f: 6
                });

            assert.equal((<any>configs)._props['a'], 1);
            assert.equal((<any>configs)._props['b'], 2);
            assert.equal((<any>configs)._props['c'], 3);
            assert.equal((<any>configs)._props['d'], 4);
            assert.equal((<any>configs)._props['e'], 5);
            assert.equal((<any>configs)._props['f'], 6);
        });

        it("load 2 props set with rewrite", () => {
            const configs = new Confinger();
            configs
                .add({
                    a: 1,
                    b: 2,
                    c: 3
                })
                .add({
                    a: 4,
                    c: 5
                });

            assert.equal((<any>configs)._props['a'], 4);
            assert.equal((<any>configs)._props['b'], 2);
            assert.equal((<any>configs)._props['c'], 5);
        });

        it("load 2 deep props set with rewrite", () => {
            const configs = new Confinger();
            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    }
                })
                .add({
                    a: 4,
                    c: 5,
                    group: {
                        c: 30
                    }
                });

            assert.deepEqual((<any>configs)._props, {
                a: 4,
                b: 2,
                c: 5,
                group: {
                    a: 10,
                    b: 20,
                    c: 30
                }
            });
        });
    });

    describe("#get", () => {
        it("get prop", () => {
            const configs = new Confinger();
            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    },
                    deep: { deep: { deep: 1337 } }
                });

            assert.equal(configs.get('a'), 1);
            assert.equal(configs.get('b'), 2);
            assert.equal(configs.get('group.a'), 10);
            assert.equal(configs.get('group.b'), 20);
            assert.equal(configs.get('deep.deep.deep'), 1337);
        });

        it("get non-existent prop with throw", () => {
            const configs = new Confinger({
                emit_error: true
            });
            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    },
                    deep: { deep: { deep: 1337 } }
                });

            let err;
            try {
                configs.get('d');
            } catch (e) {
                err = e;
            };

            assert.equal(err.message, "The configuration hasn't \"d\"");
        });

        it("get non-existent prop without throw", () => {
            const configs = new Confinger();

            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    },
                    deep: { deep: { deep: 1337 } }
                });

            let err;
            let prop;
            try {
                prop = configs.get('d');
            } catch (e) {
                err = e;
            };

            assert.ok(!err);
            assert.equal(err, undefined);
            assert.equal(prop, undefined);
        });
    });

    describe("#set", () => {
        it("set into empty config", () => {
            const configs = new Confinger();

            configs
                .set("a", 1)
                .set("b", 2)
                .set("deep.deep.deep", 1337);

            assert.equal((<any>configs)._props['a'], 1);
            assert.equal((<any>configs)._props['b'], 2);
            assert.equal((<any>configs)._props.deep.deep.deep, 1337);

            assert.equal(configs.get('a'), 1);
            assert.equal(configs.get('b'), 2);
            assert.equal(configs.get('deep.deep.deep'), 1337);
        });

        it("set into filled config", () => {
            const configs = new Confinger();

            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    },
                    deep: { deep: { deep: 1337 } }
                });

            configs.set("c", 7);

            assert.equal(configs.get('a'), 1);
            assert.equal(configs.get('b'), 2);
            assert.equal(configs.get('c'), 7);
            assert.equal(configs.get('group.a'), 10);
            assert.equal(configs.get('group.b'), 20);
            assert.equal(configs.get('deep.deep.deep'), 1337);
        });

        it("set into filled config with rewrite", () => {
            const configs = new Confinger();

            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    },
                    deep: { deep: { deep: 1337 } }
                });

            configs
                .set("a", 42)
                .set("b", 13)
                .set("c", 7)
                .set("group.a", 70);

            assert.equal(configs.get('a'), 42);
            assert.equal(configs.get('b'), 13);
            assert.equal(configs.get('c'), 7);
            assert.equal(configs.get('group.a'), 70);
            assert.equal(configs.get('group.b'), 20);
            assert.equal(configs.get('deep.deep.deep'), 1337);
        });
    });

    describe("#has", () => {
        it("check exists prop", () => {
            const configs = new Confinger();

            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    },
                    deep: { deep: { deep: 1337 } }
                });

            assert.ok(configs.has("a"));
            assert.ok(configs.has("b"));
            assert.ok(configs.has("group.a"));
            assert.ok(configs.has("group.b"));
            assert.ok(configs.has("deep.deep.deep"));
        });

        it("check non-existent prop", () => {
            const configs = new Confinger();

            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    },
                    deep: { deep: { deep: 1337 } }
                });

            assert.ok(configs.has("a"));
            assert.ok(configs.has("b"));
            assert.ok(configs.has("group.a"));
            assert.ok(configs.has("group.b"));
            assert.ok(configs.has("deep.deep.deep"));

            assert.ok(!configs.has("c"));
            assert.ok(!configs.has("d"));
            assert.ok(!configs.has("e"));
        });
    });

    describe("#del", () => {
        it("delete exists prop", () => {
            const configs = new Confinger();

            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    },
                    deep: { deep: { deep: 1337 } }
                });

            assert.equal(configs.del("a"), true);
            assert.equal(configs.del("deep.deep.deep"), true);

            assert.ok(!(<any>configs)._props['a']);
            assert.ok(!(<any>configs)._props.deep.deep.deep);

            assert.ok(configs.has("b"));
            assert.ok(configs.has("group.a"));
            assert.ok(configs.has("group.b"));

            assert.ok(!configs.has("a"));
            assert.ok(!configs.has("deep.deep.deep"));
        });

        it("delete non-existent prop", () => {
            const configs = new Confinger();

            configs
                .add({
                    a: 1,
                    b: 2,
                    group: {
                        a: 10,
                        b: 20
                    },
                    deep: { deep: { deep: 1337 } }
                });

            assert.equal(configs.del("d"), false);
            assert.equal(configs.del("e"), false);
            assert.equal(configs.del("deep.deeper"), false);

            assert.ok(!(<any>configs)._props['d']);
            assert.ok(!(<any>configs)._props['e']);
            assert.ok(!(<any>configs)._props.deep.deeper);

            assert.ok(!configs.has("d"));
            assert.ok(!configs.has("e"));
            assert.ok(!configs.has("deep.deeper"));
        });
    });
});