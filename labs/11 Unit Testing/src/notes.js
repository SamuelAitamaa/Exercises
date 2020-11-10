var notes = (function() {
    var list = [];

    return {
        add: function(note) {
            try {
                var trim = note.trim();
                if (trim.length !== 0) {
                    var item = {timestamp: Date.now(), text: note};
                    list.push(item);
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        remove: function(index) {
            if (index >= 0 && index < list.length && index != null) {
                list.splice(index, 1);
                return true;
            } else {
                return false;
            }

        },

        count: function() {
            return list.length;
        },
        list: function() {
            return list;
        },
        find: function(str) {
            for (let i=0; i < this.count; i++) {
                if(list[i].text.equals(str)) {
                    return list[i];
                } else {
                    return null;
                }
            }
        },

        clear: function() {
            list.splice(0, list.length);
        }
    }
}());