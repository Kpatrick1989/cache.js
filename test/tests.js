if (typeof require !== 'undefined') {
    // testing in command-line
    var chai = require('../node_modules/chai/chai.js');
    var Cache = require('../dist/cache.js');
}

var expect = chai.expect;
var cache = new Cache();

function clearStorage() {
    cache.clear();
}

describe('Cache', function () {
    'use strict';
    beforeEach(function () {
        clearStorage();
    });
    // afterEach(function () {
    //     clearStorage();
    // });
    describe('#Constructor', function () {
        it('Constructor should be a function', function () {
            expect(Cache).to.be.an('function');
        });
        it('has the Cache API', function () {
            expect(cache.set).to.be.an('function');
            expect(cache.get).to.be.an('function');
            expect(cache.remove).to.be.an('function');
            expect(cache.clear).to.be.an('function');
            expect(cache.update).to.be.an('function');
            expect(cache.keys).to.be.an('function');
        });
        it('启用debug正常', function () {
            cache.debug.enable();
            expect(cache.debug.state()).to.be.ok;
        });
        it('取消debug正常', function () {
            cache.debug.disabled();
            expect(cache.debug.state()).to.not.be.ok;
        });
        it('设置localStorage正常', function () {
            var local = new Cache('localStorage');
            var session = new Cache('sessionStorage');
            local.set('local', 'localStorage');
            expect(local.get('local')).to.equal('localStorage');
            expect(session.get('local')).to.be.undefined;
        });
        it('设置sessionStorage正常', function () {
            var local = new Cache('localStorage');
            var session = new Cache('sessionStorage');
            session.set('session', 'sessionStorage');
            expect(session.get('session')).to.equal('sessionStorage');
            expect(local.get('session')).to.be.undefined;
        });
    });

    describe('#API', function () {
        cache.debug.enable();
        describe('#set, #get', function () {
            it('存储字符串正常', function () {
                cache.set('setStr', 'setStr');
                expect(cache.get('setStr')).to.equal('setStr')
            });
            it('存储对象或数组正常', function () {
                cache.set('setArr', { 'arr': ['arr1', 'arr2'] });
                expect(cache.get('setArr')).to.deep.equal({ 'arr': ['arr1', 'arr2'] });
            });
            it('设置过期时间正常', function () {
                cache.set('expire', '过期时间', { type: 's', delay: 1 });
                setTimeout(function () {
                    expect(cache.get('expire')).to.be.undefined;
                }, 2000)
            });
        });
        describe('#remove', function () {
            it('移除所选数据正常', function () {
                cache.set('remove', 'test');
                cache.remove('remove');
                expect(cache.get('remove')).to.be.undefined;
            });
        });
        describe('#update', function () {
            it('更新数据和过期时间正常', function () {
                cache.set('update', '过期时间', { type: 's', delay: 1 });
                cache.update('update', '更新过期时间', { type: 's', delay: 2 });
                setTimeout(function () {
                    expect(cache.get('update')).to.be.undefined;
                }, 3000);
            });
        });
        describe('#clear', function () {
            it('清除所有数据正常', function () {
                cache.set('clear1', 'clear1');
                cache.set('clear2', 'clear2');
                cache.set('clear3', 'clear3');
                cache.clear();
                expect(cache.get('clear1')).to.be.undefined;
                expect(cache.get('clear2')).to.be.undefined;
                expect(cache.get('clear3')).to.be.undefined;
            });

            it('清楚过期数据正常', function (done) {
                this.timeout(5000);
                cache.set('clrExp1', 'clrExp1');
                cache.set('clrExp2', 'clrExp2', { type: 's', delay: 1 });
                expect(cache.get('clrExp2')).to.equal('clrExp2');
                setTimeout(function () {
                    cache.clear('exp');
                    expect(cache.get('clrExp1')).to.equal('clrExp1');
                    expect(cache.get('clrExp2')).to.be.undefined;
                    done();
                }, 2000);
            });
        });

        describe('#keys', function () {
            // it('获取所有存储数据的键名', function () {
            //     cache.set('key1', 'key1');
            //     cache.set('key2', 'key2');
            //     expect(cache.keys()[0]).to.equal('key1');
            // });

            it('获取过期数据的键名正常', function (done) {
                this.timeout(5000);
                cache.set('expKey1', 'expKey1');
                cache.set('expKey2', 'expKey2', { type: 's', delay: 1 });
                setTimeout(function () {
                    expect(cache.keys('exp')).to.deep.equal(['expKey2']);
                    done();
                }, 2000);
            });
        });
    });
});