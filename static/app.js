(function () {
  "use strict";

  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".panel");

  function showPanel(id) {
    panels.forEach(function (p) {
      var match = p.id === "panel-" + id;
      p.classList.toggle("active", match);
      p.hidden = !match;
    });
    tabs.forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-tab") === id);
    });
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      showPanel(t.getAttribute("data-tab"));
    });
  });

  function setMessage(msgId, text, isError) {
    var el = document.getElementById(msgId);
    if (!el) return;
    el.textContent = text || "";
    el.className = "message " + (isError ? "error" : "success");
  }

  var formConfig = [
    { formId: "form-img2pdf", msgId: "msg-img2pdf", action: "/api/img2pdf" },
    { formId: "form-image", msgId: "msg-image", action: "/api/image" },
    { formId: "form-encoding", msgId: "msg-encoding", action: "/api/encoding" },
    { formId: "form-line-endings", msgId: "msg-line-endings", action: "/api/line-endings" },
  ];

  formConfig.forEach(function (cfg) {
    var form = document.getElementById(cfg.formId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setMessage(cfg.msgId, "处理中…", false);
      var fd = new FormData(form);
      fetch(cfg.action, { method: "POST", body: fd })
        .then(function (res) {
          if (!res.ok) {
            return res.json().then(function (j) {
              throw new Error(j.error || res.statusText);
            });
          }
          return res;
        })
        .then(function (res) {
          return res.blob().then(function (blob) {
            var disp = res.headers.get("Content-Disposition");
            var name = "download";
            if (disp) {
              var m = disp.match(/filename\*?=(?:UTF-8'')?([^;\n]+)/) || disp.match(/filename="?([^";\n]+)"?/);
              if (m) name = (m[1] || "").trim().replace(/^["']|["']$/g, "");
              try { name = decodeURIComponent(name); } catch (_) {}
            }
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = name;
            a.click();
            URL.revokeObjectURL(a.href);
            setMessage(cfg.msgId, "已下载。", false);
          });
        })
        .catch(function (err) {
          setMessage(cfg.msgId, err.message || "请求失败", true);
        });
    });
  });
})();
