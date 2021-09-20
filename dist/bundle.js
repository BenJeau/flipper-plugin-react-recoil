var __BUNDLE_START_TIME__=this.nativePerformanceNow?nativePerformanceNow():Date.now(),__DEV__=true,process=this.process||{},__METRO_GLOBAL_PREFIX__='';process.env=process.env||{};process.env.NODE_ENV=process.env.NODE_ENV||"development";
(function (global) {
  "use strict";

  global.__r = metroRequire;
  global[`${__METRO_GLOBAL_PREFIX__}__d`] = define;
  global.__c = clear;
  global.__registerSegment = registerSegment;
  var modules = clear();
  const EMPTY = {};
  const {
    hasOwnProperty
  } = {};

  if (__DEV__) {
    global.$RefreshReg$ = () => {};

    global.$RefreshSig$ = () => type => type;
  }

  function clear() {
    modules = Object.create(null);
    return modules;
  }

  if (__DEV__) {
    var verboseNamesToModuleIds = Object.create(null);
    var initializingModuleIds = [];
  }

  function define(factory, moduleId, dependencyMap) {
    if (modules[moduleId] != null) {
      if (__DEV__) {
        const inverseDependencies = arguments[4];

        if (inverseDependencies) {
          global.__accept(moduleId, factory, dependencyMap, inverseDependencies);
        }
      }

      return;
    }

    const mod = {
      dependencyMap,
      factory,
      hasError: false,
      importedAll: EMPTY,
      importedDefault: EMPTY,
      isInitialized: false,
      publicModule: {
        exports: {}
      }
    };
    modules[moduleId] = mod;

    if (__DEV__) {
      mod.hot = createHotReloadingObject();
      const verboseName = arguments[3];

      if (verboseName) {
        mod.verboseName = verboseName;
        verboseNamesToModuleIds[verboseName] = moduleId;
      }
    }
  }

  function metroRequire(moduleId) {
    if (__DEV__ && typeof moduleId === "string") {
      const verboseName = moduleId;
      moduleId = verboseNamesToModuleIds[verboseName];

      if (moduleId == null) {
        throw new Error(`Unknown named module: "${verboseName}"`);
      } else {
        console.warn(`Requiring module "${verboseName}" by name is only supported for ` + "debugging purposes and will BREAK IN PRODUCTION!");
      }
    }

    const moduleIdReallyIsNumber = moduleId;

    if (__DEV__) {
      const initializingIndex = initializingModuleIds.indexOf(moduleIdReallyIsNumber);

      if (initializingIndex !== -1) {
        const cycle = initializingModuleIds.slice(initializingIndex).map(id => modules[id] ? modules[id].verboseName : "[unknown]");
        cycle.push(cycle[0]);
        console.warn(`Require cycle: ${cycle.join(" -> ")}\n\n` + "Require cycles are allowed, but can result in uninitialized values. " + "Consider refactoring to remove the need for a cycle.");
      }
    }

    const module = modules[moduleIdReallyIsNumber];
    return module && module.isInitialized ? module.publicModule.exports : guardedLoadModule(moduleIdReallyIsNumber, module);
  }

  function metroImportDefault(moduleId) {
    if (__DEV__ && typeof moduleId === "string") {
      const verboseName = moduleId;
      moduleId = verboseNamesToModuleIds[verboseName];
    }

    const moduleIdReallyIsNumber = moduleId;

    if (modules[moduleIdReallyIsNumber] && modules[moduleIdReallyIsNumber].importedDefault !== EMPTY) {
      return modules[moduleIdReallyIsNumber].importedDefault;
    }

    const exports = metroRequire(moduleIdReallyIsNumber);
    const importedDefault = exports && exports.__esModule ? exports.default : exports;
    return modules[moduleIdReallyIsNumber].importedDefault = importedDefault;
  }

  metroRequire.importDefault = metroImportDefault;

  function metroImportAll(moduleId) {
    if (__DEV__ && typeof moduleId === "string") {
      const verboseName = moduleId;
      moduleId = verboseNamesToModuleIds[verboseName];
    }

    const moduleIdReallyIsNumber = moduleId;

    if (modules[moduleIdReallyIsNumber] && modules[moduleIdReallyIsNumber].importedAll !== EMPTY) {
      return modules[moduleIdReallyIsNumber].importedAll;
    }

    const exports = metroRequire(moduleIdReallyIsNumber);
    let importedAll;

    if (exports && exports.__esModule) {
      importedAll = exports;
    } else {
      importedAll = {};

      if (exports) {
        for (const key in exports) {
          if (hasOwnProperty.call(exports, key)) {
            importedAll[key] = exports[key];
          }
        }
      }

      importedAll.default = exports;
    }

    return modules[moduleIdReallyIsNumber].importedAll = importedAll;
  }

  metroRequire.importAll = metroImportAll;
  let inGuard = false;

  function guardedLoadModule(moduleId, module) {
    if (!inGuard && global.ErrorUtils) {
      inGuard = true;
      let returnValue;

      try {
        returnValue = loadModuleImplementation(moduleId, module);
      } catch (e) {
        global.ErrorUtils.reportFatalError(e);
      }

      inGuard = false;
      return returnValue;
    } else {
      return loadModuleImplementation(moduleId, module);
    }
  }

  const ID_MASK_SHIFT = 16;
  const LOCAL_ID_MASK = ~0 >>> ID_MASK_SHIFT;

  function unpackModuleId(moduleId) {
    const segmentId = moduleId >>> ID_MASK_SHIFT;
    const localId = moduleId & LOCAL_ID_MASK;
    return {
      segmentId,
      localId
    };
  }

  metroRequire.unpackModuleId = unpackModuleId;

  function packModuleId(value) {
    return (value.segmentId << ID_MASK_SHIFT) + value.localId;
  }

  metroRequire.packModuleId = packModuleId;
  const moduleDefinersBySegmentID = [];
  const definingSegmentByModuleID = new Map();

  function registerSegment(segmentId, moduleDefiner, moduleIds) {
    moduleDefinersBySegmentID[segmentId] = moduleDefiner;

    if (__DEV__) {
      if (segmentId === 0 && moduleIds) {
        throw new Error("registerSegment: Expected moduleIds to be null for main segment");
      }

      if (segmentId !== 0 && !moduleIds) {
        throw new Error("registerSegment: Expected moduleIds to be passed for segment #" + segmentId);
      }
    }

    if (moduleIds) {
      moduleIds.forEach(moduleId => {
        if (!modules[moduleId] && !definingSegmentByModuleID.has(moduleId)) {
          definingSegmentByModuleID.set(moduleId, segmentId);
        }
      });
    }
  }

  function loadModuleImplementation(moduleId, module) {
    if (!module && moduleDefinersBySegmentID.length > 0) {
      var _definingSegmentByMod;

      const segmentId = (_definingSegmentByMod = definingSegmentByModuleID.get(moduleId)) !== null && _definingSegmentByMod !== void 0 ? _definingSegmentByMod : 0;
      const definer = moduleDefinersBySegmentID[segmentId];

      if (definer != null) {
        definer(moduleId);
        module = modules[moduleId];
        definingSegmentByModuleID.delete(moduleId);
      }
    }

    const nativeRequire = global.nativeRequire;

    if (!module && nativeRequire) {
      const {
        segmentId,
        localId
      } = unpackModuleId(moduleId);
      nativeRequire(localId, segmentId);
      module = modules[moduleId];
    }

    if (!module) {
      throw unknownModuleError(moduleId);
    }

    if (module.hasError) {
      throw moduleThrewError(moduleId, module.error);
    }

    if (__DEV__) {
      var Systrace = requireSystrace();
      var Refresh = requireRefresh();
    }

    module.isInitialized = true;
    const {
      factory,
      dependencyMap
    } = module;

    if (__DEV__) {
      initializingModuleIds.push(moduleId);
    }

    try {
      if (__DEV__) {
        Systrace.beginEvent("JS_require_" + (module.verboseName || moduleId));
      }

      const moduleObject = module.publicModule;

      if (__DEV__) {
        moduleObject.hot = module.hot;
        var prevRefreshReg = global.$RefreshReg$;
        var prevRefreshSig = global.$RefreshSig$;

        if (Refresh != null) {
          const RefreshRuntime = Refresh;

          global.$RefreshReg$ = (type, id) => {
            RefreshRuntime.register(type, moduleId + " " + id);
          };

          global.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
        }
      }

      moduleObject.id = moduleId;
      factory(global, metroRequire, metroImportDefault, metroImportAll, moduleObject, moduleObject.exports, dependencyMap);

      if (!__DEV__) {
        module.factory = undefined;
        module.dependencyMap = undefined;
      }

      if (__DEV__) {
        Systrace.endEvent();

        if (Refresh != null) {
          registerExportsForReactRefresh(Refresh, moduleObject.exports, moduleId);
        }
      }

      return moduleObject.exports;
    } catch (e) {
      module.hasError = true;
      module.error = e;
      module.isInitialized = false;
      module.publicModule.exports = undefined;
      throw e;
    } finally {
      if (__DEV__) {
        if (initializingModuleIds.pop() !== moduleId) {
          throw new Error("initializingModuleIds is corrupt; something is terribly wrong");
        }

        global.$RefreshReg$ = prevRefreshReg;
        global.$RefreshSig$ = prevRefreshSig;
      }
    }
  }

  function unknownModuleError(id) {
    let message = 'Requiring unknown module "' + id + '".';

    if (__DEV__) {
      message += " If you are sure the module exists, try restarting Metro. " + "You may also want to run `yarn` or `npm install`.";
    }

    return Error(message);
  }

  function moduleThrewError(id, error) {
    const displayName = __DEV__ && modules[id] && modules[id].verboseName || id;
    return Error('Requiring module "' + displayName + '", which threw an exception: ' + error);
  }

  if (__DEV__) {
    metroRequire.Systrace = {
      beginEvent: () => {},
      endEvent: () => {}
    };

    metroRequire.getModules = () => {
      return modules;
    };

    var createHotReloadingObject = function () {
      const hot = {
        _acceptCallback: null,
        _disposeCallback: null,
        _didAccept: false,
        accept: callback => {
          hot._didAccept = true;
          hot._acceptCallback = callback;
        },
        dispose: callback => {
          hot._disposeCallback = callback;
        }
      };
      return hot;
    };

    let reactRefreshTimeout = null;

    const metroHotUpdateModule = function (id, factory, dependencyMap, inverseDependencies) {
      const mod = modules[id];

      if (!mod) {
        if (factory) {
          return;
        }

        throw unknownModuleError(id);
      }

      if (!mod.hasError && !mod.isInitialized) {
        mod.factory = factory;
        mod.dependencyMap = dependencyMap;
        return;
      }

      const Refresh = requireRefresh();
      const refreshBoundaryIDs = new Set();
      let didBailOut = false;
      const updatedModuleIDs = topologicalSort([id], pendingID => {
        const pendingModule = modules[pendingID];

        if (pendingModule == null) {
          return [];
        }

        const pendingHot = pendingModule.hot;

        if (pendingHot == null) {
          throw new Error("[Refresh] Expected module.hot to always exist in DEV.");
        }

        let canAccept = pendingHot._didAccept;

        if (!canAccept && Refresh != null) {
          const isBoundary = isReactRefreshBoundary(Refresh, pendingModule.publicModule.exports);

          if (isBoundary) {
            canAccept = true;
            refreshBoundaryIDs.add(pendingID);
          }
        }

        if (canAccept) {
          return [];
        }

        const parentIDs = inverseDependencies[pendingID];

        if (parentIDs.length === 0) {
          performFullRefresh("No root boundary", {
            source: mod,
            failed: pendingModule
          });
          didBailOut = true;
          return [];
        }

        return parentIDs;
      }, () => didBailOut).reverse();

      if (didBailOut) {
        return;
      }

      const seenModuleIDs = new Set();

      for (let i = 0; i < updatedModuleIDs.length; i++) {
        const updatedID = updatedModuleIDs[i];

        if (seenModuleIDs.has(updatedID)) {
          continue;
        }

        seenModuleIDs.add(updatedID);
        const updatedMod = modules[updatedID];

        if (updatedMod == null) {
          throw new Error("[Refresh] Expected to find the updated module.");
        }

        const prevExports = updatedMod.publicModule.exports;
        const didError = runUpdatedModule(updatedID, updatedID === id ? factory : undefined, updatedID === id ? dependencyMap : undefined);
        const nextExports = updatedMod.publicModule.exports;

        if (didError) {
          return;
        }

        if (refreshBoundaryIDs.has(updatedID)) {
          const isNoLongerABoundary = !isReactRefreshBoundary(Refresh, nextExports);
          const didInvalidate = shouldInvalidateReactRefreshBoundary(Refresh, prevExports, nextExports);

          if (isNoLongerABoundary || didInvalidate) {
            const parentIDs = inverseDependencies[updatedID];

            if (parentIDs.length === 0) {
              performFullRefresh(isNoLongerABoundary ? "No longer a boundary" : "Invalidated boundary", {
                source: mod,
                failed: updatedMod
              });
              return;
            }

            for (let j = 0; j < parentIDs.length; j++) {
              const parentID = parentIDs[j];
              const parentMod = modules[parentID];

              if (parentMod == null) {
                throw new Error("[Refresh] Expected to find parent module.");
              }

              const canAcceptParent = isReactRefreshBoundary(Refresh, parentMod.publicModule.exports);

              if (canAcceptParent) {
                refreshBoundaryIDs.add(parentID);
                updatedModuleIDs.push(parentID);
              } else {
                performFullRefresh("Invalidated boundary", {
                  source: mod,
                  failed: parentMod
                });
                return;
              }
            }
          }
        }
      }

      if (Refresh != null) {
        if (reactRefreshTimeout == null) {
          reactRefreshTimeout = setTimeout(() => {
            reactRefreshTimeout = null;
            Refresh.performReactRefresh();
          }, 30);
        }
      }
    };

    const topologicalSort = function (roots, getEdges, earlyStop) {
      const result = [];
      const visited = new Set();

      function traverseDependentNodes(node) {
        visited.add(node);
        const dependentNodes = getEdges(node);

        if (earlyStop(node)) {
          return;
        }

        dependentNodes.forEach(dependent => {
          if (visited.has(dependent)) {
            return;
          }

          traverseDependentNodes(dependent);
        });
        result.push(node);
      }

      roots.forEach(root => {
        if (!visited.has(root)) {
          traverseDependentNodes(root);
        }
      });
      return result;
    };

    const runUpdatedModule = function (id, factory, dependencyMap) {
      const mod = modules[id];

      if (mod == null) {
        throw new Error("[Refresh] Expected to find the module.");
      }

      const {
        hot
      } = mod;

      if (!hot) {
        throw new Error("[Refresh] Expected module.hot to always exist in DEV.");
      }

      if (hot._disposeCallback) {
        try {
          hot._disposeCallback();
        } catch (error) {
          console.error(`Error while calling dispose handler for module ${id}: `, error);
        }
      }

      if (factory) {
        mod.factory = factory;
      }

      if (dependencyMap) {
        mod.dependencyMap = dependencyMap;
      }

      mod.hasError = false;
      mod.error = undefined;
      mod.importedAll = EMPTY;
      mod.importedDefault = EMPTY;
      mod.isInitialized = false;
      const prevExports = mod.publicModule.exports;
      mod.publicModule.exports = {};
      hot._didAccept = false;
      hot._acceptCallback = null;
      hot._disposeCallback = null;
      metroRequire(id);

      if (mod.hasError) {
        mod.hasError = false;
        mod.isInitialized = true;
        mod.error = null;
        mod.publicModule.exports = prevExports;
        return true;
      }

      if (hot._acceptCallback) {
        try {
          hot._acceptCallback();
        } catch (error) {
          console.error(`Error while calling accept handler for module ${id}: `, error);
        }
      }

      return false;
    };

    const performFullRefresh = (reason, modules) => {
      if (typeof window !== "undefined" && window.location != null && typeof window.location.reload === "function") {
        window.location.reload();
      } else {
        const Refresh = requireRefresh();

        if (Refresh != null) {
          var _modules$source$verbo, _modules$source, _modules$failed$verbo, _modules$failed;

          const sourceName = (_modules$source$verbo = (_modules$source = modules.source) === null || _modules$source === void 0 ? void 0 : _modules$source.verboseName) !== null && _modules$source$verbo !== void 0 ? _modules$source$verbo : "unknown";
          const failedName = (_modules$failed$verbo = (_modules$failed = modules.failed) === null || _modules$failed === void 0 ? void 0 : _modules$failed.verboseName) !== null && _modules$failed$verbo !== void 0 ? _modules$failed$verbo : "unknown";
          Refresh.performFullRefresh(`Fast Refresh - ${reason} <${sourceName}> <${failedName}>`);
        } else {
          console.warn("Could not reload the application after an edit.");
        }
      }
    };

    var isReactRefreshBoundary = function (Refresh, moduleExports) {
      if (Refresh.isLikelyComponentType(moduleExports)) {
        return true;
      }

      if (moduleExports == null || typeof moduleExports !== "object") {
        return false;
      }

      let hasExports = false;
      let areAllExportsComponents = true;

      for (const key in moduleExports) {
        hasExports = true;

        if (key === "__esModule") {
          continue;
        }

        const desc = Object.getOwnPropertyDescriptor(moduleExports, key);

        if (desc && desc.get) {
          return false;
        }

        const exportValue = moduleExports[key];

        if (!Refresh.isLikelyComponentType(exportValue)) {
          areAllExportsComponents = false;
        }
      }

      return hasExports && areAllExportsComponents;
    };

    var shouldInvalidateReactRefreshBoundary = (Refresh, prevExports, nextExports) => {
      const prevSignature = getRefreshBoundarySignature(Refresh, prevExports);
      const nextSignature = getRefreshBoundarySignature(Refresh, nextExports);

      if (prevSignature.length !== nextSignature.length) {
        return true;
      }

      for (let i = 0; i < nextSignature.length; i++) {
        if (prevSignature[i] !== nextSignature[i]) {
          return true;
        }
      }

      return false;
    };

    var getRefreshBoundarySignature = (Refresh, moduleExports) => {
      const signature = [];
      signature.push(Refresh.getFamilyByType(moduleExports));

      if (moduleExports == null || typeof moduleExports !== "object") {
        return signature;
      }

      for (const key in moduleExports) {
        if (key === "__esModule") {
          continue;
        }

        const desc = Object.getOwnPropertyDescriptor(moduleExports, key);

        if (desc && desc.get) {
          continue;
        }

        const exportValue = moduleExports[key];
        signature.push(key);
        signature.push(Refresh.getFamilyByType(exportValue));
      }

      return signature;
    };

    var registerExportsForReactRefresh = (Refresh, moduleExports, moduleID) => {
      Refresh.register(moduleExports, moduleID + " %exports%");

      if (moduleExports == null || typeof moduleExports !== "object") {
        return;
      }

      for (const key in moduleExports) {
        const desc = Object.getOwnPropertyDescriptor(moduleExports, key);

        if (desc && desc.get) {
          continue;
        }

        const exportValue = moduleExports[key];
        const typeID = moduleID + " %exports% " + key;
        Refresh.register(exportValue, typeID);
      }
    };

    global.__accept = metroHotUpdateModule;
  }

  if (__DEV__) {
    var requireSystrace = function requireSystrace() {
      return global[__METRO_GLOBAL_PREFIX__ + "__SYSTRACE"] || metroRequire.Systrace;
    };

    var requireRefresh = function requireRefresh() {
      return global[__METRO_GLOBAL_PREFIX__ + "__ReactRefresh"] || metroRequire.Refresh;
    };
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.plugin = plugin;
  exports.Component = Component;

  var _react = _interopRequireDefault(global.React);

  var _flipperPlugin = global.FlipperPlugin;

  var _dayjs = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[0], "dayjs"));

  var _localizedFormat = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[1], "dayjs/plugin/localizedFormat"));

  var _components = _$$_REQUIRE(_dependencyMap[2], "./components");

  var _pages = _$$_REQUIRE(_dependencyMap[3], "./pages");

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  _dayjs.default.extend(_localizedFormat.default);

  function plugin(client) {
    const rows = (0, _flipperPlugin.createState)([], {
      persist: "rows"
    });
    const atoms = (0, _flipperPlugin.createState)({}, {
      persist: "atoms"
    });
    const selection = (0, _flipperPlugin.createState)("atoms", {
      persist: "selection"
    });
    const expandData = (0, _flipperPlugin.createState)(false, {
      persist: "expandData"
    });
    client.onMessage("newRow", row => {
      const formattedRow = { ...row,
        date: (0, _dayjs.default)(row.date).format("LTS")
      };
      rows.update(draft => [...draft, formattedRow]);
      atoms.update(draft => ({ ...draft,
        [row.atom]: formattedRow
      }));
    });

    const setSelection = newSelection => {
      selection.set(newSelection);
    };

    const setExpandData = newExpandData => {
      expandData.set(newExpandData);
    };

    const clearRows = () => {
      rows.set([]);
    };

    return {
      clearRows,
      rows,
      atoms,
      selection,
      setSelection,
      expandData,
      setExpandData
    };
  }

  function Component() {
    const instance = (0, _flipperPlugin.usePlugin)(plugin);
    const selection = (0, _flipperPlugin.useValue)(instance.selection);
    return _react.default.createElement(_flipperPlugin.Layout.Container, {
      grow: true
    }, _react.default.createElement(_components.NavigationHeader, null), selection === "logs" && _react.default.createElement(_pages.RecoilLogs, null), selection === "atoms" && _react.default.createElement(_pages.AtomStates, null));
  }
},0,[1,2,3,6],"src/index.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  !function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
  }(void 0, function () {
    "use strict";

    var t = 1e3,
        e = 6e4,
        n = 36e5,
        r = "millisecond",
        i = "second",
        s = "minute",
        u = "hour",
        a = "day",
        o = "week",
        f = "month",
        h = "quarter",
        c = "year",
        d = "date",
        $ = "Invalid Date",
        l = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
        y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
        M = {
      name: "en",
      weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_")
    },
        m = function (t, e, n) {
      var r = String(t);
      return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t;
    },
        g = {
      s: m,
      z: function (t) {
        var e = -t.utcOffset(),
            n = Math.abs(e),
            r = Math.floor(n / 60),
            i = n % 60;
        return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0");
      },
      m: function t(e, n) {
        if (e.date() < n.date()) return -t(n, e);
        var r = 12 * (n.year() - e.year()) + (n.month() - e.month()),
            i = e.clone().add(r, f),
            s = n - i < 0,
            u = e.clone().add(r + (s ? -1 : 1), f);
        return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
      },
      a: function (t) {
        return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
      },
      p: function (t) {
        return {
          M: f,
          y: c,
          w: o,
          d: a,
          D: d,
          h: u,
          m: s,
          s: i,
          ms: r,
          Q: h
        }[t] || String(t || "").toLowerCase().replace(/s$/, "");
      },
      u: function (t) {
        return void 0 === t;
      }
    },
        D = "en",
        v = {};

    v[D] = M;

    var p = function (t) {
      return t instanceof _;
    },
        S = function (t, e, n) {
      var r;
      if (!t) return D;
      if ("string" == typeof t) v[t] && (r = t), e && (v[t] = e, r = t);else {
        var i = t.name;
        v[i] = t, r = i;
      }
      return !n && r && (D = r), r || !n && D;
    },
        w = function (t, e) {
      if (p(t)) return t.clone();
      var n = "object" == typeof e ? e : {};
      return n.date = t, n.args = arguments, new _(n);
    },
        O = g;

    O.l = S, O.i = p, O.w = function (t, e) {
      return w(t, {
        locale: e.$L,
        utc: e.$u,
        x: e.$x,
        $offset: e.$offset
      });
    };

    var _ = function () {
      function M(t) {
        this.$L = S(t.locale, null, !0), this.parse(t);
      }

      var m = M.prototype;
      return m.parse = function (t) {
        this.$d = function (t) {
          var e = t.date,
              n = t.utc;
          if (null === e) return new Date(NaN);
          if (O.u(e)) return new Date();
          if (e instanceof Date) return new Date(e);

          if ("string" == typeof e && !/Z$/i.test(e)) {
            var r = e.match(l);

            if (r) {
              var i = r[2] - 1 || 0,
                  s = (r[7] || "0").substring(0, 3);
              return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
            }
          }

          return new Date(e);
        }(t), this.$x = t.x || {}, this.init();
      }, m.init = function () {
        var t = this.$d;
        this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
      }, m.$utils = function () {
        return O;
      }, m.isValid = function () {
        return !(this.$d.toString() === $);
      }, m.isSame = function (t, e) {
        var n = w(t);
        return this.startOf(e) <= n && n <= this.endOf(e);
      }, m.isAfter = function (t, e) {
        return w(t) < this.startOf(e);
      }, m.isBefore = function (t, e) {
        return this.endOf(e) < w(t);
      }, m.$g = function (t, e, n) {
        return O.u(t) ? this[e] : this.set(n, t);
      }, m.unix = function () {
        return Math.floor(this.valueOf() / 1e3);
      }, m.valueOf = function () {
        return this.$d.getTime();
      }, m.startOf = function (t, e) {
        var n = this,
            r = !!O.u(e) || e,
            h = O.p(t),
            $ = function (t, e) {
          var i = O.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
          return r ? i : i.endOf(a);
        },
            l = function (t, e) {
          return O.w(n.toDate()[t].apply(n.toDate("s"), (r ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e)), n);
        },
            y = this.$W,
            M = this.$M,
            m = this.$D,
            g = "set" + (this.$u ? "UTC" : "");

        switch (h) {
          case c:
            return r ? $(1, 0) : $(31, 11);

          case f:
            return r ? $(1, M) : $(0, M + 1);

          case o:
            var D = this.$locale().weekStart || 0,
                v = (y < D ? y + 7 : y) - D;
            return $(r ? m - v : m + (6 - v), M);

          case a:
          case d:
            return l(g + "Hours", 0);

          case u:
            return l(g + "Minutes", 1);

          case s:
            return l(g + "Seconds", 2);

          case i:
            return l(g + "Milliseconds", 3);

          default:
            return this.clone();
        }
      }, m.endOf = function (t) {
        return this.startOf(t, !1);
      }, m.$set = function (t, e) {
        var n,
            o = O.p(t),
            h = "set" + (this.$u ? "UTC" : ""),
            $ = (n = {}, n[a] = h + "Date", n[d] = h + "Date", n[f] = h + "Month", n[c] = h + "FullYear", n[u] = h + "Hours", n[s] = h + "Minutes", n[i] = h + "Seconds", n[r] = h + "Milliseconds", n)[o],
            l = o === a ? this.$D + (e - this.$W) : e;

        if (o === f || o === c) {
          var y = this.clone().set(d, 1);
          y.$d[$](l), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
        } else $ && this.$d[$](l);

        return this.init(), this;
      }, m.set = function (t, e) {
        return this.clone().$set(t, e);
      }, m.get = function (t) {
        return this[O.p(t)]();
      }, m.add = function (r, h) {
        var d,
            $ = this;
        r = Number(r);

        var l = O.p(h),
            y = function (t) {
          var e = w($);
          return O.w(e.date(e.date() + Math.round(t * r)), $);
        };

        if (l === f) return this.set(f, this.$M + r);
        if (l === c) return this.set(c, this.$y + r);
        if (l === a) return y(1);
        if (l === o) return y(7);
        var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[l] || 1,
            m = this.$d.getTime() + r * M;
        return O.w(m, this);
      }, m.subtract = function (t, e) {
        return this.add(-1 * t, e);
      }, m.format = function (t) {
        var e = this,
            n = this.$locale();
        if (!this.isValid()) return n.invalidDate || $;

        var r = t || "YYYY-MM-DDTHH:mm:ssZ",
            i = O.z(this),
            s = this.$H,
            u = this.$m,
            a = this.$M,
            o = n.weekdays,
            f = n.months,
            h = function (t, n, i, s) {
          return t && (t[n] || t(e, r)) || i[n].substr(0, s);
        },
            c = function (t) {
          return O.s(s % 12 || 12, t, "0");
        },
            d = n.meridiem || function (t, e, n) {
          var r = t < 12 ? "AM" : "PM";
          return n ? r.toLowerCase() : r;
        },
            l = {
          YY: String(this.$y).slice(-2),
          YYYY: this.$y,
          M: a + 1,
          MM: O.s(a + 1, 2, "0"),
          MMM: h(n.monthsShort, a, f, 3),
          MMMM: h(f, a),
          D: this.$D,
          DD: O.s(this.$D, 2, "0"),
          d: String(this.$W),
          dd: h(n.weekdaysMin, this.$W, o, 2),
          ddd: h(n.weekdaysShort, this.$W, o, 3),
          dddd: o[this.$W],
          H: String(s),
          HH: O.s(s, 2, "0"),
          h: c(1),
          hh: c(2),
          a: d(s, u, !0),
          A: d(s, u, !1),
          m: String(u),
          mm: O.s(u, 2, "0"),
          s: String(this.$s),
          ss: O.s(this.$s, 2, "0"),
          SSS: O.s(this.$ms, 3, "0"),
          Z: i
        };

        return r.replace(y, function (t, e) {
          return e || l[t] || i.replace(":", "");
        });
      }, m.utcOffset = function () {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, m.diff = function (r, d, $) {
        var l,
            y = O.p(d),
            M = w(r),
            m = (M.utcOffset() - this.utcOffset()) * e,
            g = this - M,
            D = O.m(this, M);
        return D = (l = {}, l[c] = D / 12, l[f] = D, l[h] = D / 3, l[o] = (g - m) / 6048e5, l[a] = (g - m) / 864e5, l[u] = g / n, l[s] = g / e, l[i] = g / t, l)[y] || g, $ ? D : O.a(D);
      }, m.daysInMonth = function () {
        return this.endOf(f).$D;
      }, m.$locale = function () {
        return v[this.$L];
      }, m.locale = function (t, e) {
        if (!t) return this.$L;
        var n = this.clone(),
            r = S(t, e, !0);
        return r && (n.$L = r), n;
      }, m.clone = function () {
        return O.w(this.$d, this);
      }, m.toDate = function () {
        return new Date(this.valueOf());
      }, m.toJSON = function () {
        return this.isValid() ? this.toISOString() : null;
      }, m.toISOString = function () {
        return this.$d.toISOString();
      }, m.toString = function () {
        return this.$d.toUTCString();
      }, M;
    }(),
        b = _.prototype;

    return w.prototype = b, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach(function (t) {
      b[t[1]] = function (e) {
        return this.$g(e, t[0], t[1]);
      };
    }), w.extend = function (t, e) {
      return t.$i || (t(e, _, w), t.$i = !0), w;
    }, w.locale = S, w.isDayjs = p, w.unix = function (t) {
      return w(1e3 * t);
    }, w.en = v[D], w.Ls = v, w.p = {}, w;
  });
},1,[],"node_modules/dayjs/dayjs.min.js");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_localizedFormat = t();
  }(void 0, function () {
    "use strict";

    var e = {
      LTS: "h:mm:ss A",
      LT: "h:mm A",
      L: "MM/DD/YYYY",
      LL: "MMMM D, YYYY",
      LLL: "MMMM D, YYYY h:mm A",
      LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    return function (t, o, n) {
      var r = o.prototype,
          i = r.format;
      n.en.formats = e, r.format = function (t) {
        void 0 === t && (t = "YYYY-MM-DDTHH:mm:ssZ");

        var o = this.$locale().formats,
            n = function (t, o) {
          return t.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function (t, n, r) {
            var i = r && r.toUpperCase();
            return n || o[r] || e[r] || o[i].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function (e, t, o) {
              return t || o.slice(1);
            });
          });
        }(t, void 0 === o ? {} : o);

        return i.call(this, n);
      };
    };
  });
},2,[],"node_modules/dayjs/plugin/localizedFormat.js");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "NavigationHeader", {
    enumerable: true,
    get: function () {
      return _NavigationHeader.default;
    }
  });
  Object.defineProperty(exports, "Atom", {
    enumerable: true,
    get: function () {
      return _Atom.default;
    }
  });

  var _NavigationHeader = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[0], "./NavigationHeader"));

  var _Atom = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[1], "./Atom"));

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},3,[4,5],"src/components/index.ts");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = _interopRequireDefault(global.React);

  var _antd = global.antd;
  var _flipperPlugin = global.FlipperPlugin;
  var _icons = global.antdesign_icons;

  var _ = _$$_REQUIRE(_dependencyMap[0], "..");

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  const NavigationHeader = () => {
    const instance = (0, _flipperPlugin.usePlugin)(_.plugin);
    const selection = (0, _flipperPlugin.useValue)(instance.selection);
    return _react.default.createElement(_flipperPlugin.Toolbar, {
      position: "bottom",
      right: _react.default.createElement(_antd.Row, {
        align: "middle"
      }, _react.default.createElement(_antd.Typography.Link, {
        type: "secondary",
        href: "https://github.com/BenJeau"
      }, "Open Source", _react.default.createElement(_icons.GithubOutlined, {
        style: {
          margin: 8
        }
      })))
    }, _react.default.createElement(_antd.Radio.Group, {
      defaultValue: selection,
      onChange: ({
        target: {
          value
        }
      }) => instance.setSelection(value)
    }, _react.default.createElement(_antd.Radio.Button, {
      value: "atoms"
    }, _react.default.createElement(_icons.DeploymentUnitOutlined, {
      style: {
        marginRight: 5
      }
    }), _react.default.createElement(_antd.Typography.Text, null, "Atom States")), _react.default.createElement(_antd.Radio.Button, {
      value: "logs"
    }, _react.default.createElement(_icons.BarsOutlined, {
      style: {
        marginRight: 5
      }
    }), _react.default.createElement(_antd.Typography.Text, null, "Recoil Logs"))));
  };

  var _default = NavigationHeader;
  exports.default = _default;
},4,[0],"src/components/NavigationHeader.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = _interopRequireDefault(global.React);

  var _antd = global.antd;
  var _flipperPlugin = global.FlipperPlugin;
  var _icons = global.antdesign_icons;

  var _ = _$$_REQUIRE(_dependencyMap[0], "..");

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  const Atom = ({
    atom,
    date,
    id,
    content
  }) => {
    const instance = (0, _flipperPlugin.usePlugin)(_.plugin);
    const expandData = (0, _flipperPlugin.useValue)(instance.expandData);
    return _react.default.createElement(_antd.Col, {
      span: 24,
      xl: 12,
      xxl: 8
    }, _react.default.createElement(_antd.Card, {
      title: _react.default.createElement(_antd.Tooltip, {
        title: "Atom Name"
      }, _react.default.createElement(_antd.Tag, {
        color: "purple"
      }, atom)),
      key: id,
      extra: _react.default.createElement(_antd.Tooltip, {
        title: "Last Updated"
      }, _react.default.createElement(_antd.Row, {
        align: "middle"
      }, _react.default.createElement(_icons.ClockCircleOutlined, {
        style: {
          marginRight: 5
        }
      }), _react.default.createElement(_antd.Typography.Text, {
        type: "secondary"
      }, date))),
      size: "small",
      bodyStyle: {
        backgroundColor: "#9696961a"
      }
    }, _react.default.createElement(_flipperPlugin.DataInspector, {
      data: content,
      collapsed: !expandData
    })));
  };

  var _default = Atom;
  exports.default = _default;
},5,[0],"src/components/Atom.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "AtomStates", {
    enumerable: true,
    get: function () {
      return _AtomStates.default;
    }
  });
  Object.defineProperty(exports, "RecoilLogs", {
    enumerable: true,
    get: function () {
      return _RecoilLogs.default;
    }
  });

  var _AtomStates = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[0], "./AtomStates"));

  var _RecoilLogs = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[1], "./RecoilLogs"));

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},6,[7,8],"src/pages/index.ts");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = _interopRequireDefault(global.React);

  var _antd = global.antd;
  var _flipperPlugin = global.FlipperPlugin;
  var _icons = global.antdesign_icons;

  var _Atom = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[0], "../components/Atom"));

  var _ = _$$_REQUIRE(_dependencyMap[1], "..");

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  const AtomStates = () => {
    const instance = (0, _flipperPlugin.usePlugin)(_.plugin);
    const expandData = (0, _flipperPlugin.useValue)(instance.expandData);
    const atoms = (0, _flipperPlugin.useValue)(instance.atoms);
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_flipperPlugin.Toolbar, {
      position: "bottom"
    }, _react.default.createElement(_antd.Checkbox, {
      checked: expandData,
      onChange: ({
        target: {
          checked
        }
      }) => instance.setExpandData(checked)
    }, "Expand atom states")), _react.default.createElement(_flipperPlugin.Layout.ScrollContainer, {
      style: {
        marginTop: 8,
        marginBottom: 8
      }
    }, Object.values(atoms).length > 0 ? _react.default.createElement(_antd.Row, {
      wrap: true,
      gutter: [8, 8],
      style: {
        marginLeft: 4,
        marginRight: 4
      }
    }, Object.values(atoms).map(row => _react.default.createElement(_Atom.default, row))) : _react.default.createElement(_flipperPlugin.Layout.Container, {
      center: true,
      style: {
        width: "100%",
        padding: 40,
        color: _flipperPlugin.theme.textColorSecondary
      }
    }, _react.default.createElement(_icons.CoffeeOutlined, {
      style: {
        fontSize: "2em",
        margin: 8
      }
    }), _react.default.createElement(_antd.Typography.Text, {
      type: "secondary",
      style: {
        maxWidth: 300,
        textAlign: "center"
      }
    }, "No recorded atom change, states will appear once atoms will be modified"))));
  };

  var _default = AtomStates;
  exports.default = _default;
},7,[5,0],"src/pages/AtomStates.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = exports.rowStyle = void 0;

  var _react = _interopRequireDefault(global.React);

  var _flipperPlugin = global.FlipperPlugin;

  var _types = _$$_REQUIRE(_dependencyMap[0], "../types");

  var _ = _$$_REQUIRE(_dependencyMap[1], "..");

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  const rowStyle = state => ({ ..._flipperPlugin.theme.monospace,
    color: _types.stateTagColor[state],
    margin: 0
  });

  exports.rowStyle = rowStyle;
  const columns = [{
    key: "atom",
    onRender: row => _react.default.createElement("p", {
      style: rowStyle(row.state)
    }, row.atom),
    width: 130
  }, {
    key: "date",
    title: "Time",
    width: 150,
    onRender: row => _react.default.createElement("p", {
      style: rowStyle(row.state)
    }, row.date)
  }, {
    key: "state",
    onRender: row => _react.default.createElement("p", {
      style: rowStyle(row.state)
    }, row.state),
    filters: Object.keys(_types.AtomLoadableState).map(value => ({
      label: value,
      value,
      enabled: false
    })),
    width: 90
  }, {
    key: "content",
    wrap: true,
    onRender: row => _react.default.createElement("pre", {
      style: rowStyle(row.state)
    }, JSON.stringify(row.content, null, 2))
  }];

  const RecoilLogs = () => {
    const instance = (0, _flipperPlugin.usePlugin)(_.plugin);
    const rows = (0, _flipperPlugin.useValue)(instance.rows);
    return _react.default.createElement(_flipperPlugin.MasterDetail, {
      columns: columns,
      records: rows,
      recordsKey: "id",
      enableClear: true,
      onClear: instance.clearRows
    });
  };

  var _default = RecoilLogs;
  exports.default = _default;
},8,[9,0],"src/pages/RecoilLogs.tsx");
__d(function (global, _$$_REQUIRE, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.stateTagColor = exports.AtomLoadableState = void 0;
  var _flipperPlugin = global.FlipperPlugin;
  let AtomLoadableState;
  exports.AtomLoadableState = AtomLoadableState;

  (function (AtomLoadableState) {
    AtomLoadableState["hasValue"] = "hasValue";
    AtomLoadableState["loading"] = "loading";
    AtomLoadableState["hasError"] = "hasError";
  })(AtomLoadableState || (exports.AtomLoadableState = AtomLoadableState = {}));

  const stateTagColor = {
    hasError: _flipperPlugin.theme.errorColor,
    hasValue: _flipperPlugin.theme.textColorSecondary,
    loading: _flipperPlugin.theme.warningColor
  };
  exports.stateTagColor = stateTagColor;
},9,[],"src/types.ts");
module.exports = global.__r(0);
//# sourceMappingURL=/home/ben/code/draw_game/flipper-recoil/dist/bundle.map