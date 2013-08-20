/* Constructs a new Dict object.
 *
 * Dict(opt) -> the new Dict will be empty
 *
 * Available options:
 *   fold_case - Make has() and get() case-insensitive.  keys() and
 *               other methods that implicitly return keys return the
 *               casing used for the most recent set()
 *
 */
function Dict(opts) {
    var self = this;
    this._items = {};
    this._opts = _.extend({}, {fold_case: false}, opts);
}

/* Constructs a new Dict object from another object.
 *
 * Dict.from(jsobj, opts) -> create a Dict with keys corresponding to the
 *                           properties of jsobj and values corresponding to
 *                           the value of the appropriate property.  `opts` is
 *                           passed to the Dict constructor.
 */
Dict.from = function Dict_from(obj, opts) {
    if (typeof obj !== "object" || obj === null) {
        throw new TypeError("Cannot convert argument to Dict");
    }

    var ret = new Dict(opts);
    _.each(obj, function (val, key) {
        ret.set(key, val);
    });
    return ret;
};

(function () {
Dict.prototype = _.object(_.map({
    _munge: function Dict__munge(k) {
        if (this._opts.fold_case) {
            k = k.toLowerCase();
        }
        return ':' + k;
    },

    clone: function Dict_clone() {
        var ret = new Dict(this._opts);
        ret._items = _.clone(this._items);
        return ret;
    },

    get: function Dict_get(key) {
        var mapping = this._items[this._munge(key)];
        if (mapping === undefined) {
            return undefined;
        }
        return mapping.v;
    },

    set: function Dict_set(key, value) {
        return (this._items[this._munge(key)] = {k: key, v: value});
    },

    has: function Dict_has(key) {
        return _.has(this._items, this._munge(key));
    },

    del: function Dict_del(key) {
        return delete this._items[this._munge(key)];
    },

    keys: function Dict_keys() {
        return _.pluck(_.values(this._items), 'k');
    },

    values: function Dict_values() {
        return _.pluck(_.values(this._items), 'v');
    },

    items: function Dict_items() {
        return _.map(_.values(this._items), function (mapping) {
            return [mapping.k, mapping.v];
        });
    },

    // Iterates through the Dict calling f(value, key) for each (key, value) pair in the Dict
    each: function Dict_each(f) {
        return _.each(this._items, function (mapping) {
            f(mapping.v, mapping.k);
        });
    }
}, function (value, key) {
    return [key, util.enforce_arity(value)];
}));

}());

if (typeof module !== 'undefined') {
    module.exports = Dict;
}
