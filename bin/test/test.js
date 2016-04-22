'use strict';
/// <reference path="typings/tds.d.ts"/>
var assert = require('assert');
var Confinger = require('../confinger');
describe('Confinger', function () {
    describe('#add', function () {
        it('should load 1 props set', function () {
            var configs = new Confinger();
            configs.add({
                a: 1,
                b: 2,
                c: 3
            });
            assert.equal(configs._props['a'], 1);
            assert.equal(configs._props['b'], 2);
            assert.equal(configs._props['c'], 3);
        });
        it('should load 2 props set', function () {
            var configs = new Confinger();
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
            assert.equal(configs._props['a'], 1);
            assert.equal(configs._props['b'], 2);
            assert.equal(configs._props['c'], 3);
            assert.equal(configs._props['d'], 4);
            assert.equal(configs._props['e'], 5);
            assert.equal(configs._props['f'], 6);
        });
        it('should load 2 props set with rewrite', function () {
            var configs = new Confinger();
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
            assert.equal(configs._props['a'], 4);
            assert.equal(configs._props['b'], 2);
            assert.equal(configs._props['c'], 5);
        });
        it('should load 2 deep props set with rewrite', function () {
            var configs = new Confinger();
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
            assert.deepEqual(configs._props, {
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
        it('should load 2 (second with undefined) props set without rewrite', function () {
            var configs = new Confinger();
            configs
                .add({
                a: 1,
                b: 2,
                c: 3
            })
                .add({
                a: 4,
                c: undefined
            });
            assert.equal(configs._props['a'], 4);
            assert.equal(configs._props['b'], 2);
            assert.equal(configs._props['c'], 3);
        });
        it('should load 2 (second with undefined) props set without rewrite', function () {
            var configs = new Confinger();
            configs
                .add({
                a: 1,
                b: 2,
                group: {
                    a: 10,
                    b: 20,
                    d: 40
                },
                deep: { deep: { deep: 1337 } }
            })
                .add({
                a: undefined,
                c: 5,
                group: {
                    b: undefined,
                    c: 300
                },
                deep: undefined
            });
            assert.deepEqual(configs._props, {
                a: 1,
                b: 2,
                c: 5,
                group: {
                    a: 10,
                    b: 20,
                    c: 300,
                    d: 40
                },
                deep: { deep: { deep: 1337 } }
            });
        });
    });
    describe('#get', function () {
        it('should get prop', function () {
            var configs = new Confinger();
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
        it('should get non-existent prop with throw', function () {
            var configs = new Confinger({
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
            var err;
            try {
                configs.get('d');
            }
            catch (e) {
                err = e;
            }
            ;
            assert.equal(err.message, 'The configuration hasn\'t "d"');
        });
        it('should get non-existent prop without throw', function () {
            var configs = new Confinger();
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
            var err;
            var prop;
            try {
                prop = configs.get('d');
            }
            catch (e) {
                err = e;
            }
            ;
            assert.ok(!err);
            assert.equal(err, undefined);
            assert.equal(prop, undefined);
        });
    });
    describe('#getAll', function () {
        it('should get all props', function () {
            var configs = new Confinger();
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
            assert.deepEqual(configs.getAll(), configs._props);
            assert.deepEqual(configs.getAll(), {
                a: 1,
                b: 2,
                group: {
                    a: 10,
                    b: 20
                },
                deep: { deep: { deep: 1337 } }
            });
        });
    });
    describe('#set', function () {
        it('should set into empty config', function () {
            var configs = new Confinger();
            configs
                .set('a', 1)
                .set('b', 2)
                .set('deep.deep.deep', 1337);
            assert.equal(configs._props['a'], 1);
            assert.equal(configs._props['b'], 2);
            assert.equal(configs._props.deep.deep.deep, 1337);
            assert.equal(configs.get('a'), 1);
            assert.equal(configs.get('b'), 2);
            assert.equal(configs.get('deep.deep.deep'), 1337);
        });
        it('should set into filled config', function () {
            var configs = new Confinger();
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
            configs.set('c', 7);
            assert.equal(configs.get('a'), 1);
            assert.equal(configs.get('b'), 2);
            assert.equal(configs.get('c'), 7);
            assert.equal(configs.get('group.a'), 10);
            assert.equal(configs.get('group.b'), 20);
            assert.equal(configs.get('deep.deep.deep'), 1337);
        });
        it('should set into filled config with rewrite', function () {
            var configs = new Confinger();
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
                .set('a', 42)
                .set('b', 13)
                .set('c', 7)
                .set('group.a', 70);
            assert.equal(configs.get('a'), 42);
            assert.equal(configs.get('b'), 13);
            assert.equal(configs.get('c'), 7);
            assert.equal(configs.get('group.a'), 70);
            assert.equal(configs.get('group.b'), 20);
            assert.equal(configs.get('deep.deep.deep'), 1337);
        });
    });
    describe('#has', function () {
        it('should check exists prop', function () {
            var configs = new Confinger();
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
            assert.ok(configs.has('a'));
            assert.ok(configs.has('b'));
            assert.ok(configs.has('group.a'));
            assert.ok(configs.has('group.b'));
            assert.ok(configs.has('deep.deep.deep'));
        });
        it('should check non-existent prop', function () {
            var configs = new Confinger();
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
            assert.ok(configs.has('a'));
            assert.ok(configs.has('b'));
            assert.ok(configs.has('group.a'));
            assert.ok(configs.has('group.b'));
            assert.ok(configs.has('deep.deep.deep'));
            assert.ok(!configs.has('c'));
            assert.ok(!configs.has('d'));
            assert.ok(!configs.has('e'));
        });
    });
    describe('#del', function () {
        it('should delete exists prop', function () {
            var configs = new Confinger();
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
            assert.equal(configs.del('a'), true);
            assert.equal(configs.del('deep.deep.deep'), true);
            assert.ok(!configs._props['a']);
            assert.ok(!configs._props.deep.deep.deep);
            assert.ok(configs.has('b'));
            assert.ok(configs.has('group.a'));
            assert.ok(configs.has('group.b'));
            assert.ok(!configs.has('a'));
            assert.ok(!configs.has('deep.deep.deep'));
        });
        it('should delete non-existent prop', function () {
            var configs = new Confinger();
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
            assert.equal(configs.del('d'), false);
            assert.equal(configs.del('e'), false);
            assert.equal(configs.del('deep.deeper'), false);
            assert.ok(!configs._props['d']);
            assert.ok(!configs._props['e']);
            assert.ok(!configs._props.deep.deeper);
            assert.ok(!configs.has('d'));
            assert.ok(!configs.has('e'));
            assert.ok(!configs.has('deep.deeper'));
        });
    });
    describe('#delAll', function () {
        it('should delete all props', function () {
            var configs = new Confinger();
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
            configs.delAll();
            assert.deepEqual(configs._props, {});
            assert.deepEqual(configs.getAll(), {});
        });
    });
});
