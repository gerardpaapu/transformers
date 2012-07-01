var Transformers = Transformers || {};
(function (){
    var Transform = Transformers.Transform;

    Transform.prototype.getCSSValues = function () {
        return [
            this.a.toFixed(5),
            this.c.toFixed(5),
            this.b.toFixed(5),
            this.d.toFixed(5),
            Math.floor(this.tx),
            Math.floor(this.ty)
        ];
    };

    function format(string, arr) {
        return string.replace(/\{(\d+)\}/g, function (_, n) {
            n = parseInt(n, 10);
            return arr[n];
        });
    }

    Transform.prototype.getCSSMatrix = function () {
        var values = this.getCSSValues();
        return format('matrix({0}, {1}, {2}, {3}, {4}, {5})', values);
    };

    Transform.prototype.getCSSFilter = function () {
        var values = this.getCSSValues(),
            wrapper = 'progid:DXImageTransform.Microsoft.Matrix({0})',
            rows = 'M11={0}, M12={2}, M21={1}, M22={3}',
            defaults = "enabled=true, SizingMethod='auto expand'",
            inner;

        inner = [defaults, format(rows, values)].join(', ');
        return format(wrapper, [inner]);
    };

    Transform.prototype.getStyles = function () {
        var prefixes = ['moz', 'webkit', 'o', 'ms'],
            i = prefixes.length,
            prefix,
            styles = {},
            value = this.getCSSMatrix();

        while (i--) {
            prefix = prefixes[i];
            styles['-' + prefix + '-transform-origin'] = '0% 0%';
            styles['-' + prefix + '-transform'] = value;
        }

        styles['transform-origin'] = '0% 0%';
        styles.transform = value;

        return styles;
    };

    Transform.prototype.getIEFilters = function () {
        var filter = this.getCSSFilter();
        
        return {
            filter: filter,
            '-ms-filter': '"' + filter + '"'
        }
    };
}.call(null));