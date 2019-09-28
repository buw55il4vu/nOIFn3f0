m28n.findServerPreference = function findServerPreference(endpoint, options, cb) {
        if (typeof options == 'function') {
            cb = options;
            options = {};
        }
        findServers(endpoint, options, function(err, r) {
            if (err)
                return cb(err);
            if (!r)
                return cb("Unknown error");
            if (!r.servers)
                return cb("Invalid response");
            var availableRegions = [];

            r = {"servers":{"vultr-la":{"id":"a2nv","ipv4":"149.28.90.156","ipv6":"2001:19f0:6001:483c:5400:02ff:fe51:a53d"}}};

            for (var region in r.servers) {
                availableRegions.push(region);
            }
            if (availableRegions.length == 0) {
                cb("Couldn't find any servers in any region");
                return;
            }
            if (availableRegions.length == 1) {
                for (var region in r.servers) {
                    cb(null, [r.servers[region]]);
                    return;
                }
            }
            findRegionPreference(availableRegions, options, function(err, regionList) {
                if (err)
                    return cb(err);
                var serverList = regionList.map(function(region) {
                    return r.servers[region];
                });
                cb(null, serverList);
            });
        });
    }