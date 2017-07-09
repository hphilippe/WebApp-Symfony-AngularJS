$(document).ready(function () {
    var trigger = $('.hamburger, .overlay'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"], .overlay').click(function () {
        $('#wrapper').toggleClass('toggled');
    });
});

// Kick off the jQuery with the document ready function on page load
$(document).ready(function(){
    imagePreview();
});

// Configuration of the x and y offsets
this.imagePreview = function(){
    xOffset = 20;
    yOffset = 20;

    $("a.preview").hover(function(e){
            this.t = this.title;
            this.title = "";
            var c = (this.t != "") ? "<br/>" + this.t : "";
            $("body").append("<p id='preview'><img src='"+ this.href +"' alt='Image preview' />"+ c +"</p>");
            $("#preview")
                .css("top",(e.pageY - xOffset) + "px")
                //.css("top", "0px")
                .css("left",(e.pageX + yOffset) + "px")
                //.css("right", "0px")
                .fadeIn("slow");
        },

        function(){
            this.title = this.t;
            $("#preview").remove();

        });

    $("a.preview").mousemove(function(e){
        $("#preview")
            .css("top",(e.pageY - xOffset) + "px")
            //.css("top", "0px")
            .css("left",(e.pageX + yOffset) + "px");
            //.css("right", "0px")
    });
};


/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

(function() {
  var Dropzone, Emitter, camelize, contentLoaded, detectVerticalSquash, drawImageIOSFix, noop, without,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  noop = function() {};

  Emitter = (function() {
    function Emitter() {}

    Emitter.prototype.addEventListener = Emitter.prototype.on;

    Emitter.prototype.on = function(event, fn) {
      this._callbacks = this._callbacks || {};
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }
      this._callbacks[event].push(fn);
      return this;
    };

    Emitter.prototype.emit = function() {
      var args, callback, callbacks, event, _i, _len;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this._callbacks = this._callbacks || {};
      callbacks = this._callbacks[event];
      if (callbacks) {
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          callback.apply(this, args);
        }
      }
      return this;
    };

    Emitter.prototype.removeListener = Emitter.prototype.off;

    Emitter.prototype.removeAllListeners = Emitter.prototype.off;

    Emitter.prototype.removeEventListener = Emitter.prototype.off;

    Emitter.prototype.off = function(event, fn) {
      var callback, callbacks, i, _i, _len;
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      }
      callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }
      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      }
      for (i = _i = 0, _len = callbacks.length; _i < _len; i = ++_i) {
        callback = callbacks[i];
        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    return Emitter;

  })();

  Dropzone = (function(_super) {
    var extend, resolveOption;

    __extends(Dropzone, _super);

    Dropzone.prototype.Emitter = Emitter;


    /*
    This is a list of all available events you can register on a dropzone object.
    
    You can register an event handler like this:
    
        dropzone.on("dragEnter", function() { });
     */

    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

    Dropzone.prototype.defaultOptions = {
      url: null,
      method: "post",
      withCredentials: false,
      parallelUploads: 2,
      uploadMultiple: false,
      maxFilesize: 256,
      paramName: "file",
      createImageThumbnails: true,
      maxThumbnailFilesize: 10,
      thumbnailWidth: 120,
      thumbnailHeight: 120,
      filesizeBase: 1000,
      maxFiles: null,
      params: {},
      clickable: true,
      ignoreHiddenFiles: true,
      acceptedFiles: null,
      acceptedMimeTypes: null,
      autoProcessQueue: true,
      autoQueue: true,
      addRemoveLinks: false,
      previewsContainer: null,
      hiddenInputContainer: "body",
      capture: null,
      renameFilename: null,
      dictDefaultMessage: "Drop files here to upload",
      dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
      dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
      dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
      dictInvalidFileType: "You can't upload files of this type.",
      dictResponseError: "Server responded with {{statusCode}} code.",
      dictCancelUpload: "Cancel upload",
      dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
      dictRemoveFile: "Remove file",
      dictRemoveFileConfirmation: null,
      dictMaxFilesExceeded: "You can not upload any more files.",
      accept: function(file, done) {
        return done();
      },
      init: function() {
        return noop;
      },
      forceFallback: false,
      fallback: function() {
        var child, messageElement, span, _i, _len, _ref;
        this.element.className = "" + this.element.className + " dz-browser-not-supported";
        _ref = this.element.getElementsByTagName("div");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (/(^| )dz-message($| )/.test(child.className)) {
            messageElement = child;
            child.className = "dz-message";
            continue;
          }
        }
        if (!messageElement) {
          messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }
        span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          if (span.textContent != null) {
            span.textContent = this.options.dictFallbackMessage;
          } else if (span.innerText != null) {
            span.innerText = this.options.dictFallbackMessage;
          }
        }
        return this.element.appendChild(this.getFallbackForm());
      },
      resize: function(file) {
        var info, srcRatio, trgRatio;
        info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        info.optWidth = this.options.thumbnailWidth;
        info.optHeight = this.options.thumbnailHeight;
        if ((info.optWidth == null) && (info.optHeight == null)) {
          info.optWidth = info.srcWidth;
          info.optHeight = info.srcHeight;
        } else if (info.optWidth == null) {
          info.optWidth = srcRatio * info.optHeight;
        } else if (info.optHeight == null) {
          info.optHeight = (1 / srcRatio) * info.optWidth;
        }
        trgRatio = info.optWidth / info.optHeight;
        if (file.height < info.optHeight || file.width < info.optWidth) {
          info.trgHeight = info.srcHeight;
          info.trgWidth = info.srcWidth;
        } else {
          if (srcRatio > trgRatio) {
            info.srcHeight = file.height;
            info.srcWidth = info.srcHeight * trgRatio;
          } else {
            info.srcWidth = file.width;
            info.srcHeight = info.srcWidth / trgRatio;
          }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        return info;
      },

      /*
      Those functions register themselves to the events on init and handle all
      the user interface specific stuff. Overwriting them won't break the upload
      but can break the way it's displayed.
      You can overwrite them if you don't like the default behavior. If you just
      want to add an additional event handler, register it on the dropzone object
      and don't overwrite those options.
       */
      drop: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragstart: noop,
      dragend: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragenter: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragover: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragleave: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      paste: noop,
      reset: function() {
        return this.element.classList.remove("dz-started");
      },
      addedfile: function(file) {
        var node, removeFileEvent, removeLink, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        if (this.element === this.previewsContainer) {
          this.element.classList.add("dz-started");
        }
        if (this.previewsContainer) {
          file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
          file.previewTemplate = file.previewElement;
          this.previewsContainer.appendChild(file.previewElement);
          _ref = file.previewElement.querySelectorAll("[data-dz-name]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            node.textContent = this._renameFilename(file.name);
          }
          _ref1 = file.previewElement.querySelectorAll("[data-dz-size]");
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            node = _ref1[_j];
            node.innerHTML = this.filesize(file.size);
          }
          if (this.options.addRemoveLinks) {
            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
            file.previewElement.appendChild(file._removeLink);
          }
          removeFileEvent = (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function() {
                  return _this.removeFile(file);
                });
              } else {
                if (_this.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function() {
                    return _this.removeFile(file);
                  });
                } else {
                  return _this.removeFile(file);
                }
              }
            };
          })(this);
          _ref2 = file.previewElement.querySelectorAll("[data-dz-remove]");
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            removeLink = _ref2[_k];
            _results.push(removeLink.addEventListener("click", removeFileEvent));
          }
          return _results;
        }
      },
      removedfile: function(file) {
        var _ref;
        if (file.previewElement) {
          if ((_ref = file.previewElement) != null) {
            _ref.parentNode.removeChild(file.previewElement);
          }
        }
        return this._updateMaxFilesReachedClass();
      },
      thumbnail: function(file, dataUrl) {
        var thumbnailElement, _i, _len, _ref;
        if (file.previewElement) {
          file.previewElement.classList.remove("dz-file-preview");
          _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thumbnailElement = _ref[_i];
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
          }
          return setTimeout(((function(_this) {
            return function() {
              return file.previewElement.classList.add("dz-image-preview");
            };
          })(this)), 1);
        }
      },
      error: function(file, message) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          file.previewElement.classList.add("dz-error");
          if (typeof message !== "String" && message.error) {
            message = message.error;
          }
          _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.textContent = message);
          }
          return _results;
        }
      },
      errormultiple: noop,
      processing: function(file) {
        if (file.previewElement) {
          file.previewElement.classList.add("dz-processing");
          if (file._removeLink) {
            return file._removeLink.textContent = this.options.dictCancelUpload;
          }
        }
      },
      processingmultiple: noop,
      uploadprogress: function(file, progress, bytesSent) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            if (node.nodeName === 'PROGRESS') {
              _results.push(node.value = progress);
            } else {
              _results.push(node.style.width = "" + progress + "%");
            }
          }
          return _results;
        }
      },
      totaluploadprogress: noop,
      sending: noop,
      sendingmultiple: noop,
      success: function(file) {
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-success");
        }
      },
      successmultiple: noop,
      canceled: function(file) {
        return this.emit("error", file, "Upload canceled.");
      },
      canceledmultiple: noop,
      complete: function(file) {
        if (file._removeLink) {
          file._removeLink.textContent = this.options.dictRemoveFile;
        }
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-complete");
        }
      },
      completemultiple: noop,
      maxfilesexceeded: noop,
      maxfilesreached: noop,
      queuecomplete: noop,
      addedfiles: noop,
      previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>"
    };

    extend = function() {
      var key, object, objects, target, val, _i, _len;
      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          val = object[key];
          target[key] = val;
        }
      }
      return target;
    };

    function Dropzone(element, options) {
      var elementOptions, fallback, _ref;
      this.element = element;
      this.version = Dropzone.version;
      this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
      this.clickableElements = [];
      this.listeners = [];
      this.files = [];
      if (typeof this.element === "string") {
        this.element = document.querySelector(this.element);
      }
      if (!(this.element && (this.element.nodeType != null))) {
        throw new Error("Invalid dropzone element.");
      }
      if (this.element.dropzone) {
        throw new Error("Dropzone already attached.");
      }
      Dropzone.instances.push(this);
      this.element.dropzone = this;
      elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
      this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
      if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
        return this.options.fallback.call(this);
      }
      if (this.options.url == null) {
        this.options.url = this.element.getAttribute("action");
      }
      if (!this.options.url) {
        throw new Error("No URL provided.");
      }
      if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
      }
      if (this.options.acceptedMimeTypes) {
        this.options.acceptedFiles = this.options.acceptedMimeTypes;
        delete this.options.acceptedMimeTypes;
      }
      this.options.method = this.options.method.toUpperCase();
      if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
        fallback.parentNode.removeChild(fallback);
      }
      if (this.options.previewsContainer !== false) {
        if (this.options.previewsContainer) {
          this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
        } else {
          this.previewsContainer = this.element;
        }
      }
      if (this.options.clickable) {
        if (this.options.clickable === true) {
          this.clickableElements = [this.element];
        } else {
          this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
        }
      }
      this.init();
    }

    Dropzone.prototype.getAcceptedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getRejectedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (!file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getFilesWithStatus = function(status) {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === status) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getQueuedFiles = function() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    };

    Dropzone.prototype.getUploadingFiles = function() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    };

    Dropzone.prototype.getAddedFiles = function() {
      return this.getFilesWithStatus(Dropzone.ADDED);
    };

    Dropzone.prototype.getActiveFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.init = function() {
      var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1;
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }
      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }
      if (this.clickableElements.length) {
        setupHiddenFileInput = (function(_this) {
          return function() {
            if (_this.hiddenFileInput) {
              _this.hiddenFileInput.parentNode.removeChild(_this.hiddenFileInput);
            }
            _this.hiddenFileInput = document.createElement("input");
            _this.hiddenFileInput.setAttribute("type", "file");
            if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
              _this.hiddenFileInput.setAttribute("multiple", "multiple");
            }
            _this.hiddenFileInput.className = "dz-hidden-input";
            if (_this.options.acceptedFiles != null) {
              _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
            }
            if (_this.options.capture != null) {
              _this.hiddenFileInput.setAttribute("capture", _this.options.capture);
            }
            _this.hiddenFileInput.style.visibility = "hidden";
            _this.hiddenFileInput.style.position = "absolute";
            _this.hiddenFileInput.style.top = "0";
            _this.hiddenFileInput.style.left = "0";
            _this.hiddenFileInput.style.height = "0";
            _this.hiddenFileInput.style.width = "0";
            document.querySelector(_this.options.hiddenInputContainer).appendChild(_this.hiddenFileInput);
            return _this.hiddenFileInput.addEventListener("change", function() {
              var file, files, _i, _len;
              files = _this.hiddenFileInput.files;
              if (files.length) {
                for (_i = 0, _len = files.length; _i < _len; _i++) {
                  file = files[_i];
                  _this.addFile(file);
                }
              }
              _this.emit("addedfiles", files);
              return setupHiddenFileInput();
            });
          };
        })(this);
        setupHiddenFileInput();
      }
      this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        this.on(eventName, this.options[eventName]);
      }
      this.on("uploadprogress", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("removedfile", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("canceled", (function(_this) {
        return function(file) {
          return _this.emit("complete", file);
        };
      })(this));
      this.on("complete", (function(_this) {
        return function(file) {
          if (_this.getAddedFiles().length === 0 && _this.getUploadingFiles().length === 0 && _this.getQueuedFiles().length === 0) {
            return setTimeout((function() {
              return _this.emit("queuecomplete");
            }), 0);
          }
        };
      })(this));
      noPropagation = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };
      this.listeners = [
        {
          element: this.element,
          events: {
            "dragstart": (function(_this) {
              return function(e) {
                return _this.emit("dragstart", e);
              };
            })(this),
            "dragenter": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.emit("dragenter", e);
              };
            })(this),
            "dragover": (function(_this) {
              return function(e) {
                var efct;
                try {
                  efct = e.dataTransfer.effectAllowed;
                } catch (_error) {}
                e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
                noPropagation(e);
                return _this.emit("dragover", e);
              };
            })(this),
            "dragleave": (function(_this) {
              return function(e) {
                return _this.emit("dragleave", e);
              };
            })(this),
            "drop": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.drop(e);
              };
            })(this),
            "dragend": (function(_this) {
              return function(e) {
                return _this.emit("dragend", e);
              };
            })(this)
          }
        }
      ];
      this.clickableElements.forEach((function(_this) {
        return function(clickableElement) {
          return _this.listeners.push({
            element: clickableElement,
            events: {
              "click": function(evt) {
                if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                  _this.hiddenFileInput.click();
                }
                return true;
              }
            }
          });
        };
      })(this));
      this.enable();
      return this.options.init.call(this);
    };

    Dropzone.prototype.destroy = function() {
      var _ref;
      this.disable();
      this.removeAllFiles(true);
      if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    };

    Dropzone.prototype.updateTotalUploadProgress = function() {
      var activeFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
      totalBytesSent = 0;
      totalBytes = 0;
      activeFiles = this.getActiveFiles();
      if (activeFiles.length) {
        _ref = this.getActiveFiles();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }
      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    };

    Dropzone.prototype._getParamName = function(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    };

    Dropzone.prototype._renameFilename = function(name) {
      if (typeof this.options.renameFilename !== "function") {
        return name;
      }
      return this.options.renameFilename(name);
    };

    Dropzone.prototype.getFallbackForm = function() {
      var existingFallback, fields, fieldsString, form;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }
      fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + (this._getParamName(0)) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + " /><input type=\"submit\" value=\"Upload!\"></div>";
      fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    };

    Dropzone.prototype.getExistingFallback = function() {
      var fallback, getFallback, tagName, _i, _len, _ref;
      getFallback = function(elements) {
        var el, _i, _len;
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };
      _ref = ["div", "form"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    };

    Dropzone.prototype.setupEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.removeEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.disable = function() {
      var file, _i, _len, _ref, _results;
      this.clickableElements.forEach(function(element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(this.cancelUpload(file));
      }
      return _results;
    };

    Dropzone.prototype.enable = function() {
      this.clickableElements.forEach(function(element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    };

    Dropzone.prototype.filesize = function(size) {
      var cutoff, i, selectedSize, selectedUnit, unit, units, _i, _len;
      selectedSize = 0;
      selectedUnit = "b";
      if (size > 0) {
        units = ['TB', 'GB', 'MB', 'KB', 'b'];
        for (i = _i = 0, _len = units.length; _i < _len; i = ++_i) {
          unit = units[i];
          cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;
          if (size >= cutoff) {
            selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
            selectedUnit = unit;
            break;
          }
        }
        selectedSize = Math.round(10 * selectedSize) / 10;
      }
      return "<strong>" + selectedSize + "</strong> " + selectedUnit;
    };

    Dropzone.prototype._updateMaxFilesReachedClass = function() {
      if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    };

    Dropzone.prototype.drop = function(e) {
      var files, items;
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);
      files = e.dataTransfer.files;
      this.emit("addedfiles", files);
      if (files.length) {
        items = e.dataTransfer.items;
        if (items && items.length && (items[0].webkitGetAsEntry != null)) {
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    };

    Dropzone.prototype.paste = function(e) {
      var items, _ref;
      if ((e != null ? (_ref = e.clipboardData) != null ? _ref.items : void 0 : void 0) == null) {
        return;
      }
      this.emit("paste", e);
      items = e.clipboardData.items;
      if (items.length) {
        return this._addFilesFromItems(items);
      }
    };

    Dropzone.prototype.handleFiles = function(files) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.addFile(file));
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromItems = function(items) {
      var entry, item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
          if (entry.isFile) {
            _results.push(this.addFile(item.getAsFile()));
          } else if (entry.isDirectory) {
            _results.push(this._addFilesFromDirectory(entry, entry.name));
          } else {
            _results.push(void 0);
          }
        } else if (item.getAsFile != null) {
          if ((item.kind == null) || item.kind === "file") {
            _results.push(this.addFile(item.getAsFile()));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromDirectory = function(directory, path) {
      var dirReader, errorHandler, readEntries;
      dirReader = directory.createReader();
      errorHandler = function(error) {
        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
      };
      readEntries = (function(_this) {
        return function() {
          return dirReader.readEntries(function(entries) {
            var entry, _i, _len;
            if (entries.length > 0) {
              for (_i = 0, _len = entries.length; _i < _len; _i++) {
                entry = entries[_i];
                if (entry.isFile) {
                  entry.file(function(file) {
                    if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                      return;
                    }
                    file.fullPath = "" + path + "/" + file.name;
                    return _this.addFile(file);
                  });
                } else if (entry.isDirectory) {
                  _this._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
                }
              }
              readEntries();
            }
            return null;
          }, errorHandler);
        };
      })(this);
      return readEntries();
    };

    Dropzone.prototype.accept = function(file, done) {
      if (file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    };

    Dropzone.prototype.addFile = function(file) {
      file.upload = {
        progress: 0,
        total: file.size,
        bytesSent: 0
      };
      this.files.push(file);
      file.status = Dropzone.ADDED;
      this.emit("addedfile", file);
      this._enqueueThumbnail(file);
      return this.accept(file, (function(_this) {
        return function(error) {
          if (error) {
            file.accepted = false;
            _this._errorProcessing([file], error);
          } else {
            file.accepted = true;
            if (_this.options.autoQueue) {
              _this.enqueueFile(file);
            }
          }
          return _this._updateMaxFilesReachedClass();
        };
      })(this));
    };

    Dropzone.prototype.enqueueFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        this.enqueueFile(file);
      }
      return null;
    };

    Dropzone.prototype.enqueueFile = function(file) {
      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(((function(_this) {
            return function() {
              return _this.processQueue();
            };
          })(this)), 0);
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    };

    Dropzone.prototype._thumbnailQueue = [];

    Dropzone.prototype._processingThumbnail = false;

    Dropzone.prototype._enqueueThumbnail = function(file) {
      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(((function(_this) {
          return function() {
            return _this._processThumbnailQueue();
          };
        })(this)), 0);
      }
    };

    Dropzone.prototype._processThumbnailQueue = function() {
      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }
      this._processingThumbnail = true;
      return this.createThumbnail(this._thumbnailQueue.shift(), (function(_this) {
        return function() {
          _this._processingThumbnail = false;
          return _this._processThumbnailQueue();
        };
      })(this));
    };

    Dropzone.prototype.removeFile = function(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);
      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    };

    Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
      var file, _i, _len, _ref;
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      _ref = this.files.slice();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    };

    Dropzone.prototype.createThumbnail = function(file, callback) {
      var fileReader;
      fileReader = new FileReader;
      fileReader.onload = (function(_this) {
        return function() {
          if (file.type === "image/svg+xml") {
            _this.emit("thumbnail", file, fileReader.result);
            if (callback != null) {
              callback();
            }
            return;
          }
          return _this.createThumbnailFromUrl(file, fileReader.result, callback);
        };
      })(this);
      return fileReader.readAsDataURL(file);
    };

    Dropzone.prototype.createThumbnailFromUrl = function(file, imageUrl, callback, crossOrigin) {
      var img;
      img = document.createElement("img");
      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }
      img.onload = (function(_this) {
        return function() {
          var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
          file.width = img.width;
          file.height = img.height;
          resizeInfo = _this.options.resize.call(_this, file);
          if (resizeInfo.trgWidth == null) {
            resizeInfo.trgWidth = resizeInfo.optWidth;
          }
          if (resizeInfo.trgHeight == null) {
            resizeInfo.trgHeight = resizeInfo.optHeight;
          }
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;
          drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
          thumbnail = canvas.toDataURL("image/png");
          _this.emit("thumbnail", file, thumbnail);
          if (callback != null) {
            return callback();
          }
        };
      })(this);
      if (callback != null) {
        img.onerror = callback;
      }
      return img.src = imageUrl;
    };

    Dropzone.prototype.processQueue = function() {
      var i, parallelUploads, processingLength, queuedFiles;
      parallelUploads = this.options.parallelUploads;
      processingLength = this.getUploadingFiles().length;
      i = processingLength;
      if (processingLength >= parallelUploads) {
        return;
      }
      queuedFiles = this.getQueuedFiles();
      if (!(queuedFiles.length > 0)) {
        return;
      }
      if (this.options.uploadMultiple) {
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          }
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    };

    Dropzone.prototype.processFile = function(file) {
      return this.processFiles([file]);
    };

    Dropzone.prototype.processFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.processing = true;
        file.status = Dropzone.UPLOADING;
        this.emit("processing", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }
      return this.uploadFiles(files);
    };

    Dropzone.prototype._getFilesWithXhr = function(xhr) {
      var file, files;
      return files = (function() {
        var _i, _len, _ref, _results;
        _ref = this.files;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (file.xhr === xhr) {
            _results.push(file);
          }
        }
        return _results;
      }).call(this);
    };

    Dropzone.prototype.cancelUpload = function(file) {
      var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
      if (file.status === Dropzone.UPLOADING) {
        groupedFiles = this._getFilesWithXhr(file.xhr);
        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
          groupedFile = groupedFiles[_i];
          groupedFile.status = Dropzone.CANCELED;
        }
        file.xhr.abort();
        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
          groupedFile = groupedFiles[_j];
          this.emit("canceled", groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    resolveOption = function() {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof option === 'function') {
        return option.apply(this, args);
      }
      return option;
    };

    Dropzone.prototype.uploadFile = function(file) {
      return this.uploadFiles([file]);
    };

    Dropzone.prototype.uploadFiles = function(files) {
      var file, formData, handleError, headerName, headerValue, headers, i, input, inputName, inputType, key, method, option, progressObj, response, updateProgress, url, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      xhr = new XMLHttpRequest();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.xhr = xhr;
      }
      method = resolveOption(this.options.method, files);
      url = resolveOption(this.options.url, files);
      xhr.open(method, url, true);
      xhr.withCredentials = !!this.options.withCredentials;
      response = null;
      handleError = (function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
            file = files[_j];
            _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
          }
          return _results;
        };
      })(this);
      updateProgress = (function(_this) {
        return function(e) {
          var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
          if (e != null) {
            progress = 100 * e.loaded / e.total;
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              file = files[_j];
              file.upload = {
                progress: progress,
                total: e.total,
                bytesSent: e.loaded
              };
            }
          } else {
            allFilesFinished = true;
            progress = 100;
            for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
              file = files[_k];
              if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                allFilesFinished = false;
              }
              file.upload.progress = progress;
              file.upload.bytesSent = file.upload.total;
            }
            if (allFilesFinished) {
              return;
            }
          }
          _results = [];
          for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
            file = files[_l];
            _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
          }
          return _results;
        };
      })(this);
      xhr.onload = (function(_this) {
        return function(e) {
          var _ref;
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          if (xhr.readyState !== 4) {
            return;
          }
          response = xhr.responseText;
          if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
            try {
              response = JSON.parse(response);
            } catch (_error) {
              e = _error;
              response = "Invalid JSON response from server.";
            }
          }
          updateProgress();
          if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
            return handleError();
          } else {
            return _this._finished(files, response, e);
          }
        };
      })(this);
      xhr.onerror = (function(_this) {
        return function() {
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          return handleError();
        };
      })(this);
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = updateProgress;
      headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (this.options.headers) {
        extend(headers, this.options.headers);
      }
      for (headerName in headers) {
        headerValue = headers[headerName];
        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }
      formData = new FormData();
      if (this.options.params) {
        _ref1 = this.options.params;
        for (key in _ref1) {
          value = _ref1[key];
          formData.append(key, value);
        }
      }
      for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
        file = files[_j];
        this.emit("sending", file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }
      if (this.element.tagName === "FORM") {
        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          input = _ref2[_k];
          inputName = input.getAttribute("name");
          inputType = input.getAttribute("type");
          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            _ref3 = input.options;
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              option = _ref3[_l];
              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
      for (i = _m = 0, _ref5 = files.length - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        formData.append(this._getParamName(i), files[i], this._renameFilename(files[i].name));
      }
      return this.submitRequest(xhr, formData, files);
    };

    Dropzone.prototype.submitRequest = function(xhr, formData, files) {
      return xhr.send(formData);
    };

    Dropzone.prototype._finished = function(files, responseText, e) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    Dropzone.prototype._errorProcessing = function(files, message, xhr) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    return Dropzone;

  })(Emitter);

  Dropzone.version = "4.3.0";

  Dropzone.options = {};

  Dropzone.optionsForElement = function(element) {
    if (element.getAttribute("id")) {
      return Dropzone.options[camelize(element.getAttribute("id"))];
    } else {
      return void 0;
    }
  };

  Dropzone.instances = [];

  Dropzone.forElement = function(element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    if ((element != null ? element.dropzone : void 0) == null) {
      throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
    }
    return element.dropzone;
  };

  Dropzone.autoDiscover = true;

  Dropzone.discover = function() {
    var checkElements, dropzone, dropzones, _i, _len, _results;
    if (document.querySelectorAll) {
      dropzones = document.querySelectorAll(".dropzone");
    } else {
      dropzones = [];
      checkElements = function(elements) {
        var el, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )dropzone($| )/.test(el.className)) {
            _results.push(dropzones.push(el));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      checkElements(document.getElementsByTagName("div"));
      checkElements(document.getElementsByTagName("form"));
    }
    _results = [];
    for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
      dropzone = dropzones[_i];
      if (Dropzone.optionsForElement(dropzone) !== false) {
        _results.push(new Dropzone(dropzone));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

  Dropzone.isBrowserSupported = function() {
    var capableBrowser, regex, _i, _len, _ref;
    capableBrowser = true;
    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
      if (!("classList" in document.createElement("a"))) {
        capableBrowser = false;
      } else {
        _ref = Dropzone.blacklistedBrowsers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      }
    } else {
      capableBrowser = false;
    }
    return capableBrowser;
  };

  without = function(list, rejectedItem) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item !== rejectedItem) {
        _results.push(item);
      }
    }
    return _results;
  };

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match.charAt(1).toUpperCase();
    });
  };

  Dropzone.createElement = function(string) {
    var div;
    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  Dropzone.elementInside = function(element, container) {
    if (element === container) {
      return true;
    }
    while (element = element.parentNode) {
      if (element === container) {
        return true;
      }
    }
    return false;
  };

  Dropzone.getElement = function(el, name) {
    var element;
    if (typeof el === "string") {
      element = document.querySelector(el);
    } else if (el.nodeType != null) {
      element = el;
    }
    if (element == null) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
    }
    return element;
  };

  Dropzone.getElements = function(els, name) {
    var e, el, elements, _i, _j, _len, _len1, _ref;
    if (els instanceof Array) {
      elements = [];
      try {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          elements.push(this.getElement(el, name));
        }
      } catch (_error) {
        e = _error;
        elements = null;
      }
    } else if (typeof els === "string") {
      elements = [];
      _ref = document.querySelectorAll(els);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        elements.push(el);
      }
    } else if (els.nodeType != null) {
      elements = [els];
    }
    if (!((elements != null) && elements.length)) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
    }
    return elements;
  };

  Dropzone.confirm = function(question, accepted, rejected) {
    if (window.confirm(question)) {
      return accepted();
    } else if (rejected != null) {
      return rejected();
    }
  };

  Dropzone.isValidFile = function(file, acceptedFiles) {
    var baseMimeType, mimeType, validType, _i, _len;
    if (!acceptedFiles) {
      return true;
    }
    acceptedFiles = acceptedFiles.split(",");
    mimeType = file.type;
    baseMimeType = mimeType.replace(/\/.*$/, "");
    for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
      validType = acceptedFiles[_i];
      validType = validType.trim();
      if (validType.charAt(0) === ".") {
        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
          return true;
        }
      } else if (/\/\*$/.test(validType)) {
        if (baseMimeType === validType.replace(/\/.*$/, "")) {
          return true;
        }
      } else {
        if (mimeType === validType) {
          return true;
        }
      }
    }
    return false;
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.dropzone = function(options) {
      return this.each(function() {
        return new Dropzone(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Dropzone;
  } else {
    window.Dropzone = Dropzone;
  }

  Dropzone.ADDED = "added";

  Dropzone.QUEUED = "queued";

  Dropzone.ACCEPTED = Dropzone.QUEUED;

  Dropzone.UPLOADING = "uploading";

  Dropzone.PROCESSING = Dropzone.UPLOADING;

  Dropzone.CANCELED = "canceled";

  Dropzone.ERROR = "error";

  Dropzone.SUCCESS = "success";


  /*
  
  Bugfix for iOS 6 and 7
  Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
  based on the work of https://github.com/stomita/ios-imagefile-megapixel
   */

  detectVerticalSquash = function(img) {
    var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
    iw = img.naturalWidth;
    ih = img.naturalHeight;
    canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = ih;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    data = ctx.getImageData(0, 0, 1, ih).data;
    sy = 0;
    ey = ih;
    py = ih;
    while (py > sy) {
      alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    ratio = py / ih;
    if (ratio === 0) {
      return 1;
    } else {
      return ratio;
    }
  };

  drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio;
    vertSquashRatio = detectVerticalSquash(img);
    return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
  };


  /*
   * contentloaded.js
   *
   * Author: Diego Perini (diego.perini at gmail.com)
   * Summary: cross-browser wrapper for DOMContentLoaded
   * Updated: 20101020
   * License: MIT
   * Version: 1.2
   *
   * URL:
   * http://javascript.nwbox.com/ContentLoaded/
   * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
   */

  contentLoaded = function(win, fn) {
    var add, doc, done, init, poll, pre, rem, root, top;
    done = false;
    top = true;
    doc = win.document;
    root = doc.documentElement;
    add = (doc.addEventListener ? "addEventListener" : "attachEvent");
    rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
    pre = (doc.addEventListener ? "" : "on");
    init = function(e) {
      if (e.type === "readystatechange" && doc.readyState !== "complete") {
        return;
      }
      (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        return fn.call(win, e.type || e);
      }
    };
    poll = function() {
      var e;
      try {
        root.doScroll("left");
      } catch (_error) {
        e = _error;
        setTimeout(poll, 50);
        return;
      }
      return init("poll");
    };
    if (doc.readyState !== "complete") {
      if (doc.createEventObject && root.doScroll) {
        try {
          top = !win.frameElement;
        } catch (_error) {}
        if (top) {
          poll();
        }
      }
      doc[add](pre + "DOMContentLoaded", init, false);
      doc[add](pre + "readystatechange", init, false);
      return win[add](pre + "load", init, false);
    }
  };

  Dropzone._autoDiscoverFunction = function() {
    if (Dropzone.autoDiscover) {
      return Dropzone.discover();
    }
  };

  contentLoaded(window, Dropzone._autoDiscoverFunction);

}).call(this);

/*!
 * bootstrap-fileinput v4.4.0
 * http://plugins.krajee.com/file-input
 *
 * Author: Kartik Visweswaran
 * Copyright: 2014 - 2017, Kartik Visweswaran, Krajee.com
 *
 * Licensed under the BSD 3-Clause
 * https://github.com/kartik-v/bootstrap-fileinput/blob/master/LICENSE.md
 */!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(window.jQuery)}(function(e){"use strict";e.fn.fileinputLocales={},e.fn.fileinputThemes={};var i,t;i={FRAMES:".kv-preview-thumb",SORT_CSS:"file-sortable",STYLE_SETTING:'style="width:{width};height:{height};"',OBJECT_PARAMS:'<param name="controller" value="true" />\n<param name="allowFullScreen" value="true" />\n<param name="allowScriptAccess" value="always" />\n<param name="autoPlay" value="false" />\n<param name="autoStart" value="false" />\n<param name="quality" value="high" />\n',DEFAULT_PREVIEW:'<div class="file-preview-other">\n<span class="{previewFileIconClass}">{previewFileIcon}</span>\n</div>',MODAL_ID:"kvFileinputModal",MODAL_EVENTS:["show","shown","hide","hidden","loaded"],objUrl:window.URL||window.webkitURL,compare:function(e,i,t){return void 0!==e&&(t?e===i:e.match(i))},isIE:function(e){if("Microsoft Internet Explorer"!==navigator.appName)return!1;if(10===e)return new RegExp("msie\\s"+e,"i").test(navigator.userAgent);var i,t=document.createElement("div");return t.innerHTML="<!--[if IE "+e+"]> <i></i> <![endif]-->",i=t.getElementsByTagName("i").length,document.body.appendChild(t),t.parentNode.removeChild(t),i},initModal:function(i){var t=e("body");t.length&&i.appendTo(t)},isEmpty:function(i,t){return void 0===i||null===i||0===i.length||t&&""===e.trim(i)},isArray:function(e){return Array.isArray(e)||"[object Array]"===Object.prototype.toString.call(e)},ifSet:function(e,i,t){return t=t||"",i&&"object"==typeof i&&e in i?i[e]:t},cleanArray:function(e){return e instanceof Array||(e=[]),e.filter(function(e){return void 0!==e&&null!==e})},spliceArray:function(e,i){var t,a=0,r=[];if(!(e instanceof Array))return[];for(t=0;t<e.length;t++)t!==i&&(r[a]=e[t],a++);return r},getNum:function(e,i){return i=i||0,"number"==typeof e?e:("string"==typeof e&&(e=parseFloat(e)),isNaN(e)?i:e)},hasFileAPISupport:function(){return!(!window.File||!window.FileReader)},hasDragDropSupport:function(){var e=document.createElement("div");return!i.isIE(9)&&(void 0!==e.draggable||void 0!==e.ondragstart&&void 0!==e.ondrop)},hasFileUploadSupport:function(){return i.hasFileAPISupport()&&window.FormData},addCss:function(e,i){e.removeClass(i).addClass(i)},getElement:function(t,a,r){return i.isEmpty(t)||i.isEmpty(t[a])?r:e(t[a])},uniqId:function(){return Math.round((new Date).getTime()+100*Math.random())},htmlEncode:function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")},replaceTags:function(i,t){var a=i;return t?(e.each(t,function(e,i){"function"==typeof i&&(i=i()),a=a.split(e).join(i)}),a):a},cleanMemory:function(e){var t=e.is("img")?e.attr("src"):e.find("source").attr("src");i.objUrl.revokeObjectURL(t)},findFileName:function(e){var i=e.lastIndexOf("/");return-1===i&&(i=e.lastIndexOf("\\")),e.split(e.substring(i,i+1)).pop()},checkFullScreen:function(){return document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement},toggleFullScreen:function(e){var t=document,a=t.documentElement;a&&e&&!i.checkFullScreen()?a.requestFullscreen?a.requestFullscreen():a.msRequestFullscreen?a.msRequestFullscreen():a.mozRequestFullScreen?a.mozRequestFullScreen():a.webkitRequestFullscreen&&a.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT):t.exitFullscreen?t.exitFullscreen():t.msExitFullscreen?t.msExitFullscreen():t.mozCancelFullScreen?t.mozCancelFullScreen():t.webkitExitFullscreen&&t.webkitExitFullscreen()},moveArray:function(e,i,t){if(t>=e.length)for(var a=t-e.length;a--+1;)e.push(void 0);return e.splice(t,0,e.splice(i,1)[0]),e},cleanZoomCache:function(e){var i=e.closest(".kv-zoom-cache-theme");i.length||(i=e.closest(".kv-zoom-cache")),i.remove()}},t=function(t,a){var r=this;r.$element=e(t),r._validate()&&(r.isPreviewable=i.hasFileAPISupport(),r.isIE9=i.isIE(9),r.isIE10=i.isIE(10),r.isPreviewable||r.isIE9?(r._init(a),r._listen()):r.$element.removeClass("file-loading"))},t.prototype={constructor:t,_init:function(t){var a,r,n=this,o=n.$element;n.options=t,e.each(t,function(e,t){switch(e){case"minFileCount":case"maxFileCount":case"minFileSize":case"maxFileSize":case"maxFilePreviewSize":case"resizeImageQuality":case"resizeIfSizeMoreThan":case"progressUploadThreshold":case"initialPreviewCount":case"zoomModalHeight":case"minImageHeight":case"maxImageHeight":case"minImageWidth":case"maxImageWidth":n[e]=i.getNum(t);break;default:n[e]=t}}),n.$form=o.closest("form"),n._initTemplateDefaults(),n.fileInputCleared=!1,n.fileBatchCompleted=!0,n.isPreviewable||(n.showPreview=!1),n.uploadFileAttr=i.isEmpty(o.attr("name"))?"file_data":o.attr("name"),n.reader=null,n.formdata={},n.clearStack(),n.uploadCount=0,n.uploadStatus={},n.uploadLog=[],n.uploadAsyncCount=0,n.loadedImages=[],n.totalImagesCount=0,n.ajaxRequests=[],n.isError=!1,n.ajaxAborted=!1,n.cancelling=!1,r=n._getLayoutTemplate("progress"),n.progressTemplate=r.replace("{class}",n.progressClass),n.progressCompleteTemplate=r.replace("{class}",n.progressCompleteClass),n.progressErrorTemplate=r.replace("{class}",n.progressErrorClass),n.dropZoneEnabled=i.hasDragDropSupport()&&n.dropZoneEnabled,n.isDisabled=o.attr("disabled")||o.attr("readonly"),n.isDisabled&&o.attr("disabled",!0),n.isUploadable=i.hasFileUploadSupport()&&!i.isEmpty(n.uploadUrl),n.isClickable=n.browseOnZoneClick&&n.showPreview&&(n.isUploadable&&n.dropZoneEnabled||!i.isEmpty(n.defaultPreviewContent)),n.slug="function"==typeof t.slugCallback?t.slugCallback:n._slugDefault,n.mainTemplate=n.showCaption?n._getLayoutTemplate("main1"):n._getLayoutTemplate("main2"),n.captionTemplate=n._getLayoutTemplate("caption"),n.previewGenericTemplate=n._getPreviewTemplate("generic"),n.resizeImage&&(n.maxImageWidth||n.maxImageHeight)&&(n.imageCanvas=document.createElement("canvas"),n.imageCanvasContext=n.imageCanvas.getContext("2d")),i.isEmpty(o.attr("id"))&&o.attr("id",i.uniqId()),n.namespace=".fileinput_"+o.attr("id").replace(/-/g,"_"),void 0===n.$container?n.$container=n._createContainer():n._refreshContainer(),a=n.$container,n.$dropZone=a.find(".file-drop-zone"),n.$progress=a.find(".kv-upload-progress"),n.$btnUpload=a.find(".fileinput-upload"),n.$captionContainer=i.getElement(t,"elCaptionContainer",a.find(".file-caption")),n.$caption=i.getElement(t,"elCaptionText",a.find(".file-caption-name")),n.$previewContainer=i.getElement(t,"elPreviewContainer",a.find(".file-preview")),n.$preview=i.getElement(t,"elPreviewImage",a.find(".file-preview-thumbnails")),n.$previewStatus=i.getElement(t,"elPreviewStatus",a.find(".file-preview-status")),n.$errorContainer=i.getElement(t,"elErrorContainer",n.$previewContainer.find(".kv-fileinput-error")),i.isEmpty(n.msgErrorClass)||i.addCss(n.$errorContainer,n.msgErrorClass),n.$errorContainer.hide(),n.previewInitId="preview-"+i.uniqId(),n._initPreviewCache(),n._initPreview(!0),n._initPreviewActions(),n._setFileDropZoneTitle(),o.removeClass("file-loading"),o.attr("disabled")&&n.disable(),n._initZoom()},_initTemplateDefaults:function(){var t,a,r,n,o,l,s,d,c,p,u,f,m,g,v,h,w,_,b,C,y,E,x,T,S,F,I,P,k,z,A,$,D,U,j,R=this;t='{preview}\n<div class="kv-upload-progress hide"></div>\n<div class="input-group {class}">\n   {caption}\n   <div class="input-group-btn">\n       {remove}\n       {cancel}\n       {upload}\n       {browse}\n   </div>\n</div>',a='{preview}\n<div class="kv-upload-progress hide"></div>\n{remove}\n{cancel}\n{upload}\n{browse}\n',r='<div class="file-preview {class}">\n    {close}    <div class="{dropClass}">\n    <div class="file-preview-thumbnails">\n    </div>\n    <div class="clearfix"></div>    <div class="file-preview-status text-center text-success"></div>\n    <div class="kv-fileinput-error"></div>\n    </div>\n</div>',o='<div class="close fileinput-remove">&times;</div>\n',n='<i class="glyphicon glyphicon-file kv-caption-icon"></i>',l='<div tabindex="500" class="form-control file-caption {class}">\n   <div class="file-caption-name"></div>\n</div>\n',s='<button type="{type}" tabindex="500" title="{title}" class="{css}" {status}>{icon} {label}</button>',d='<a href="{href}" tabindex="500" title="{title}" class="{css}" {status}>{icon} {label}</a>',c='<div tabindex="500" class="{css}" {status}>{icon} {label}</div>',p='<div id="'+i.MODAL_ID+'" class="file-zoom-dialog modal fade" tabindex="-1" aria-labelledby="'+i.MODAL_ID+'Label"></div>',u='<div class="modal-dialog modal-lg" role="document">\n  <div class="modal-content">\n    <div class="modal-header">\n      <div class="kv-zoom-actions pull-right">{toggleheader}{fullscreen}{borderless}{close}</div>\n      <h3 class="modal-title">{heading} <small><span class="kv-zoom-title"></span></small></h3>\n    </div>\n    <div class="modal-body">\n      <div class="floating-buttons"></div>\n      <div class="kv-zoom-body file-zoom-content {zoomFrameClass}"></div>\n{prev} {next}\n    </div>\n  </div>\n</div>\n',f='<div class="progress">\n    <div class="{class}" role="progressbar" aria-valuenow="{percent}" aria-valuemin="0" aria-valuemax="100" style="width:{percent}%;">\n        {status}\n     </div>\n</div>',m=" <samp>({sizeText})</samp>",g='<div class="file-thumbnail-footer">\n    <div class="file-footer-caption" title="{caption}">{caption}<br>{size}</div>\n    {progress} {actions}\n</div>',v='<div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>\n{drag}\n<div class="file-actions">\n    <div class="file-footer-buttons">\n        {upload} {delete} {zoom} {other}    </div>\n    <div class="clearfix"></div>\n</div>',h='<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}" {dataUrl}{dataKey}>{removeIcon}</button>\n',w='<button type="button" class="kv-file-upload {uploadClass}" title="{uploadTitle}">{uploadIcon}</button>',_='<button type="button" class="kv-file-zoom {zoomClass}" title="{zoomTitle}">{zoomIcon}</button>',b='<span class="file-drag-handle {dragClass}" title="{dragTitle}">{dragIcon}</span>',C='<div class="file-preview-frame {frameClass}" id="{previewId}" data-fileindex="{fileindex}" data-template="{template}"',y=C+'><div class="kv-file-content">\n',E=C+' title="{caption}"><div class="kv-file-content">\n',x="</div>{footer}\n</div>\n",T="{content}\n",S='<div class="kv-preview-data file-preview-html" title="{caption}" '+i.STYLE_SETTING+">{data}</div>\n",F='<img src="{data}" class="file-preview-image kv-preview-data" title="{caption}" alt="{caption}" '+i.STYLE_SETTING+">\n",I='<textarea class="kv-preview-data file-preview-text" title="{caption}" readonly '+i.STYLE_SETTING+">{data}</textarea>\n",P='<video class="kv-preview-data file-preview-video" width="{width}" height="{height}" controls>\n<source src="{data}" type="{type}">\n'+i.DEFAULT_PREVIEW+"\n</video>\n",k='<div class="file-preview-audio"><audio class="kv-preview-data" controls>\n<source src="{data}" type="{type}">\n'+i.DEFAULT_PREVIEW+"\n</audio></div>\n",z='<object class="kv-preview-data file-object" type="application/x-shockwave-flash" width="{width}" height="{height}" data="{data}">\n'+i.OBJECT_PARAMS+" "+i.DEFAULT_PREVIEW+"\n</object>\n",A='<object class="kv-preview-data file-object {typeCss}" data="{data}" type="{type}" width="{width}" height="{height}">\n<param name="movie" value="{caption}" />\n'+i.OBJECT_PARAMS+" "+i.DEFAULT_PREVIEW+"\n</object>\n",$='<embed class="kv-preview-data" src="{data}" width="{width}" height="{height}" type="application/pdf">\n',D='<div class="kv-preview-data file-preview-other-frame">\n'+i.DEFAULT_PREVIEW+"\n</div>\n",U='<div class="kv-zoom-cache" style="display:none">{zoomContent}</div>',j={width:"100%",height:"100%","min-height":"480px"},R.defaults={layoutTemplates:{main1:t,main2:a,preview:r,close:o,fileIcon:n,caption:l,modalMain:p,modal:u,progress:f,size:m,footer:g,actions:v,actionDelete:h,actionUpload:w,actionZoom:_,actionDrag:b,btnDefault:s,btnLink:d,btnBrowse:c,zoomCache:U},previewMarkupTags:{tagBefore1:y,tagBefore2:E,tagAfter:x},previewContentTemplates:{generic:T,html:S,image:F,text:I,video:P,audio:k,flash:z,object:A,pdf:$,other:D},allowedPreviewTypes:["image","html","text","video","audio","flash","pdf","object"],previewTemplates:{},previewSettings:{image:{width:"auto",height:"160px"},html:{width:"213px",height:"160px"},text:{width:"213px",height:"160px"},video:{width:"auto",height:"100%","max-width":"100%"},audio:{width:"100%",height:"30px"},flash:{width:"auto",height:"100%","max-width":"100%"},object:{height:"100%"},pdf:{width:"160px",height:"160px"},other:{width:"160px",height:"160px"}},previewZoomSettings:{image:{width:"auto",height:"auto","max-width":"100%","max-height":"100%"},html:j,text:j,video:{width:"auto",height:"100%","max-width":"100%"},audio:{width:"100%",height:"30px"},flash:{width:"auto",height:"480px"},object:{width:"auto",height:"100%","max-width":"100%","min-height":"480px"},pdf:j,other:{width:"auto",height:"100%","min-height":"480px"}},fileTypeSettings:{image:function(e,t){return i.compare(e,"image.*")||i.compare(t,/\.(gif|png|jpe?g)$/i)},html:function(e,t){return i.compare(e,"text/html")||i.compare(t,/\.(htm|html)$/i)},text:function(e,t){return i.compare(e,"text.*")||i.compare(t,/\.(xml|javascript)$/i)||i.compare(t,/\.(txt|md|csv|nfo|ini|json|php|js|css)$/i)},video:function(e,t){return i.compare(e,"video.*")&&(i.compare(e,/(ogg|mp4|mp?g|mov|webm|3gp)$/i)||i.compare(t,/\.(og?|mp4|webm|mp?g|mov|3gp)$/i))},audio:function(e,t){return i.compare(e,"audio.*")&&(i.compare(t,/(ogg|mp3|mp?g|wav)$/i)||i.compare(t,/\.(og?|mp3|mp?g|wav)$/i))},flash:function(e,t){return i.compare(e,"application/x-shockwave-flash",!0)||i.compare(t,/\.(swf)$/i)},pdf:function(e,t){return i.compare(e,"application/pdf",!0)||i.compare(t,/\.(pdf)$/i)},object:function(){return!0},other:function(){return!0}},fileActionSettings:{showRemove:!0,showUpload:!0,showZoom:!0,showDrag:!0,removeIcon:'<i class="glyphicon glyphicon-trash text-danger"></i>',removeClass:"btn btn-xs btn-default",removeTitle:"Remove file",uploadIcon:'<i class="glyphicon glyphicon-upload text-info"></i>',uploadClass:"btn btn-xs btn-default",uploadTitle:"Upload file",zoomIcon:'<i class="glyphicon glyphicon-zoom-in"></i>',zoomClass:"btn btn-xs btn-default",zoomTitle:"View Details",dragIcon:'<i class="glyphicon glyphicon-menu-hamburger"></i>',dragClass:"text-info",dragTitle:"Move / Rearrange",dragSettings:{},indicatorNew:'<i class="glyphicon glyphicon-hand-down text-warning"></i>',indicatorSuccess:'<i class="glyphicon glyphicon-ok-sign text-success"></i>',indicatorError:'<i class="glyphicon glyphicon-exclamation-sign text-danger"></i>',indicatorLoading:'<i class="glyphicon glyphicon-hand-up text-muted"></i>',indicatorNewTitle:"Not uploaded yet",indicatorSuccessTitle:"Uploaded",indicatorErrorTitle:"Upload Error",indicatorLoadingTitle:"Uploading ..."}},e.each(R.defaults,function(i,t){return"allowedPreviewTypes"===i?void(void 0===R.allowedPreviewTypes&&(R.allowedPreviewTypes=t)):void(R[i]=e.extend(!0,{},t,R[i]))}),R._initPreviewTemplates()},_initPreviewTemplates:function(){var t,a=this,r=a.defaults,n=a.previewMarkupTags,o=n.tagAfter;e.each(r.previewContentTemplates,function(e,r){i.isEmpty(a.previewTemplates[e])&&(t=n.tagBefore2,"generic"!==e&&"image"!==e&&"html"!==e&&"text"!==e||(t=n.tagBefore1),a.previewTemplates[e]=t+r+o)})},_initPreviewCache:function(){var t=this;t.previewCache={data:{},init:function(){var e=t.initialPreview;e.length>0&&!i.isArray(e)&&(e=e.split(t.initialPreviewDelimiter)),t.previewCache.data={content:e,config:t.initialPreviewConfig,tags:t.initialPreviewThumbTags}},fetch:function(){return t.previewCache.data.content.filter(function(e){return null!==e})},count:function(e){return t.previewCache.data&&t.previewCache.data.content?e?t.previewCache.data.content.length:t.previewCache.fetch().length:0},get:function(a,r){var n,o,l,s,d,c,p,u="init_"+a,f=t.previewCache.data,m=f.config[a],g=f.content[a],v=t.previewInitId+"-"+u,h=i.ifSet("previewAsData",m,t.initialPreviewAsData),w=function(e,a,r,n,o,l,s,d,c){return d=" file-preview-initial "+i.SORT_CSS+(d?" "+d:""),t._generatePreviewTemplate(e,a,r,n,o,!1,null,d,l,s,c)};return g?(r=void 0===r?!0:r,l=i.ifSet("type",m,t.initialPreviewFileType||"generic"),d=i.ifSet("filename",m,i.ifSet("caption",m)),c=i.ifSet("filetype",m,l),s=t.previewCache.footer(a,r,m&&m.size||null),p=i.ifSet("frameClass",m),n=h?w(l,g,d,c,v,s,u,p):w("generic",g,d,c,v,s,u,p,l).replace(/\{content}/g,f.content[a]),f.tags.length&&f.tags[a]&&(n=i.replaceTags(n,f.tags[a])),i.isEmpty(m)||i.isEmpty(m.frameAttr)||(o=e(document.createElement("div")).html(n),o.find(".file-preview-initial").attr(m.frameAttr),n=o.html(),o.remove()),n):""},add:function(e,a,r,n){var o,l=t.previewCache.data;return i.isArray(e)||(e=e.split(t.initialPreviewDelimiter)),n?(o=l.content.push(e)-1,l.config[o]=a,l.tags[o]=r):(o=e.length-1,l.content=e,l.config=a,l.tags=r),t.previewCache.data=l,o},set:function(e,a,r,n){var o,l,s=t.previewCache.data;if(e&&e.length&&(i.isArray(e)||(e=e.split(t.initialPreviewDelimiter)),l=e.filter(function(e){return null!==e}),l.length)){if(void 0===s.content&&(s.content=[]),void 0===s.config&&(s.config=[]),void 0===s.tags&&(s.tags=[]),n){for(o=0;o<e.length;o++)e[o]&&s.content.push(e[o]);for(o=0;o<a.length;o++)a[o]&&s.config.push(a[o]);for(o=0;o<r.length;o++)r[o]&&s.tags.push(r[o])}else s.content=e,s.config=a,s.tags=r;t.previewCache.data=s}},unset:function(e){var i=t.previewCache.count();if(i){if(1===i)return t.previewCache.data.content=[],t.previewCache.data.config=[],t.previewCache.data.tags=[],t.initialPreview=[],t.initialPreviewConfig=[],void(t.initialPreviewThumbTags=[]);t.previewCache.data.content[e]=null,t.previewCache.data.config[e]=null,t.previewCache.data.tags[e]=null}},out:function(){var e,i,a="",r=t.previewCache.count(!0);if(0===r)return{content:"",caption:""};for(i=0;r>i;i++)a+=t.previewCache.get(i);return e=t._getMsgSelected(t.previewCache.count()),{content:a,caption:e}},footer:function(e,a,r){var n=t.previewCache.data;if(!n||!n.config||0===n.config.length||i.isEmpty(n.config[e]))return"";a=void 0===a?!0:a;var o=n.config[e],l=i.ifSet("caption",o),s="",d=i.ifSet("width",o,"auto"),c=i.ifSet("url",o,!1),p=i.ifSet("key",o,null),u=t.fileActionSettings,f=i.ifSet("showDelete",o,!0),m=i.ifSet("showZoom",o,u.showZoom),g=i.ifSet("showDrag",o,u.showDrag),v=c===!1&&a;return t.initialPreviewShowDelete&&(s=t._renderFileActions(!1,f,m,g,v,c,p,!0)),t._getLayoutTemplate("footer").replace(/\{progress}/g,t._renderThumbProgress()).replace(/\{actions}/g,s).replace(/\{caption}/g,l).replace(/\{size}/g,t._getSize(r)).replace(/\{width}/g,d).replace(/\{indicator}/g,"").replace(/\{indicatorTitle}/g,"")}},t.previewCache.init()},_handler:function(e,i,t){var a=this,r=a.namespace,n=i.split(" ").join(r+" ")+r;e&&e.length&&e.off(n).on(n,t)},_log:function(e){var i=this,t=i.$element.attr("id");t&&(e='"'+t+'": '+e),"undefined"!=typeof window.console.log?window.console.log(e):window.alert(e)},_validate:function(){var e=this,i="file"===e.$element.attr("type");return i||e._log('The input "type" must be set to "file" for initializing the "bootstrap-fileinput" plugin.'),i},_errorsExist:function(){var i,t=this;return t.$errorContainer.find("li").length?!0:(i=e(document.createElement("div")).html(t.$errorContainer.html()),i.find("span.kv-error-close").remove(),i.find("ul").remove(),!!e.trim(i.text()).length)},_errorHandler:function(e,i){var t=this,a=e.target.error;a.code===a.NOT_FOUND_ERR?t._showError(t.msgFileNotFound.replace("{name}",i)):a.code===a.SECURITY_ERR?t._showError(t.msgFileSecured.replace("{name}",i)):a.code===a.NOT_READABLE_ERR?t._showError(t.msgFileNotReadable.replace("{name}",i)):a.code===a.ABORT_ERR?t._showError(t.msgFilePreviewAborted.replace("{name}",i)):t._showError(t.msgFilePreviewError.replace("{name}",i))},_addError:function(e){var i=this,t=i.$errorContainer;e&&t.length&&(t.html(i.errorCloseButton+e),i._handler(t.find(".kv-error-close"),"click",function(){t.fadeOut("slow")}))},_resetErrors:function(e){var i=this,t=i.$errorContainer;i.isError=!1,i.$container.removeClass("has-error"),t.html(""),e?t.fadeOut("slow"):t.hide()},_showFolderError:function(e){var t,a=this,r=a.$errorContainer;e&&(t=a.msgFoldersNotAllowed.replace(/\{n}/g,e),a._addError(t),i.addCss(a.$container,"has-error"),r.fadeIn(800),a._raise("filefoldererror",[e,t]))},_showUploadError:function(e,t,a){var r=this,n=r.$errorContainer,o=a||"fileuploaderror",l=t&&t.id?'<li data-file-id="'+t.id+'">'+e+"</li>":"<li>"+e+"</li>";return 0===n.find("ul").length?r._addError("<ul>"+l+"</ul>"):n.find("ul").append(l),n.fadeIn(800),r._raise(o,[t,e]),r.$container.removeClass("file-input-new"),i.addCss(r.$container,"has-error"),!0},_showError:function(e,t,a){var r=this,n=r.$errorContainer,o=a||"fileerror";return t=t||{},t.reader=r.reader,r._addError(e),n.fadeIn(800),r._raise(o,[t,e]),r.isUploadable||r._clearFileInput(),r.$container.removeClass("file-input-new"),i.addCss(r.$container,"has-error"),r.$btnUpload.attr("disabled",!0),!0},_noFilesError:function(e){var t=this,a=t.minFileCount>1?t.filePlural:t.fileSingle,r=t.msgFilesTooLess.replace("{n}",t.minFileCount).replace("{files}",a),n=t.$errorContainer;t._addError(r),t.isError=!0,t._updateFileDetails(0),n.fadeIn(800),t._raise("fileerror",[e,r]),t._clearFileInput(),i.addCss(t.$container,"has-error")},_parseError:function(i,t,a,r){var n=this,o=e.trim(a+""),l="."===o.slice(-1)?"":".",s=void 0!==t.responseJSON&&void 0!==t.responseJSON.error?t.responseJSON.error:t.responseText;return n.cancelling&&n.msgUploadAborted&&(o=n.msgUploadAborted),n.showAjaxErrorDetails&&s?(s=e.trim(s.replace(/\n\s*\n/g,"\n")),s=s.length>0?"<pre>"+s+"</pre>":"",o+=l+s):o+=l,o===l&&(o=n.msgAjaxError.replace("{operation}",i)),n.cancelling=!1,r?"<b>"+r+": </b>"+o:o},_parseFileType:function(e){var t,a,r,n,o=this,l=o.allowedPreviewTypes||[];for(n=0;n<l.length;n++)if(r=l[n],t=o.fileTypeSettings[r],a=t(e.type,e.name)?r:"",!i.isEmpty(a))return a;return"other"},_getPreviewIcon:function(i){var t,a=this,r=null;return i&&i.indexOf(".")>-1&&(t=i.split(".").pop(),a.previewFileIconSettings&&a.previewFileIconSettings[t]&&(r=a.previewFileIconSettings[t]),a.previewFileExtSettings&&e.each(a.previewFileExtSettings,function(e,i){return a.previewFileIconSettings[e]&&i(t)?void(r=a.previewFileIconSettings[e]):void 0})),r},_parseFilePreviewIcon:function(e,i){var t=this,a=t._getPreviewIcon(i)||t.previewFileIcon;return e.indexOf("{previewFileIcon}")>-1&&(e=e.replace(/\{previewFileIconClass}/g,t.previewFileIconClass).replace(/\{previewFileIcon}/g,a)),e},_raise:function(i,t){var a=this,r=e.Event(i);if(void 0!==t?a.$element.trigger(r,t):a.$element.trigger(r),r.isDefaultPrevented()||r.result===!1)return!1;switch(i){case"filebatchuploadcomplete":case"filebatchuploadsuccess":case"fileuploaded":case"fileclear":case"filecleared":case"filereset":case"fileerror":case"filefoldererror":case"fileuploaderror":case"filebatchuploaderror":case"filedeleteerror":case"filecustomerror":case"filesuccessremove":break;default:a.ajaxAborted=r.result}return!0},_listenFullScreen:function(e){var i,t,a=this,r=a.$modal;r&&r.length&&(i=r&&r.find(".btn-fullscreen"),t=r&&r.find(".btn-borderless"),i.length&&t.length&&(i.removeClass("active").attr("aria-pressed","false"),t.removeClass("active").attr("aria-pressed","false"),e?i.addClass("active").attr("aria-pressed","true"):t.addClass("active").attr("aria-pressed","true"),r.hasClass("file-zoom-fullscreen")?a._maximizeZoomDialog():e?a._maximizeZoomDialog():t.removeClass("active").attr("aria-pressed","false")))},_listen:function(){var t,a=this,r=a.$element,n=a.$form,o=a.$container;a._handler(r,"change",e.proxy(a._change,a)),a.showBrowse&&a._handler(a.$btnFile,"click",e.proxy(a._browse,a)),a._handler(o.find(".fileinput-remove:not([disabled])"),"click",e.proxy(a.clear,a)),a._handler(o.find(".fileinput-cancel"),"click",e.proxy(a.cancel,a)),a._initDragDrop(),a._handler(n,"reset",e.proxy(a.reset,a)),a.isUploadable||a._handler(n,"submit",e.proxy(a._submitForm,a)),a._handler(a.$container.find(".fileinput-upload"),"click",e.proxy(a._uploadClick,a)),a._handler(e(window),"resize",function(){a._listenFullScreen(screen.width===window.innerWidth&&screen.height===window.innerHeight)}),t="webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange",a._handler(e(document),t,function(){a._listenFullScreen(i.checkFullScreen())}),a._initClickable()},_initClickable:function(){var t,a=this;a.isClickable&&(t=a.isUploadable?a.$dropZone:a.$preview.find(".file-default-preview"),i.addCss(t,"clickable"),t.attr("tabindex",-1),a._handler(t,"click",function(i){var r=e(i.target);r.parents(".file-preview-thumbnails").length&&!r.parents(".file-default-preview").length||(a.$element.trigger("click"),t.blur())}))},_initDragDrop:function(){var i=this,t=i.$dropZone;i.isUploadable&&i.dropZoneEnabled&&i.showPreview&&(i._handler(t,"dragenter dragover",e.proxy(i._zoneDragEnter,i)),i._handler(t,"dragleave",e.proxy(i._zoneDragLeave,i)),i._handler(t,"drop",e.proxy(i._zoneDrop,i)),i._handler(e(document),"dragenter dragover drop",i._zoneDragDropInit))},_zoneDragDropInit:function(e){e.stopPropagation(),e.preventDefault()},_zoneDragEnter:function(t){var a=this,r=e.inArray("Files",t.originalEvent.dataTransfer.types)>-1;return a._zoneDragDropInit(t),a.isDisabled||!r?(t.originalEvent.dataTransfer.effectAllowed="none",void(t.originalEvent.dataTransfer.dropEffect="none")):void i.addCss(a.$dropZone,"file-highlighted")},_zoneDragLeave:function(e){var i=this;i._zoneDragDropInit(e),i.isDisabled||i.$dropZone.removeClass("file-highlighted")},_zoneDrop:function(e){var t=this;e.preventDefault(),t.isDisabled||i.isEmpty(e.originalEvent.dataTransfer.files)||(t._change(e,"dragdrop"),t.$dropZone.removeClass("file-highlighted"))},_uploadClick:function(e){var t,a=this,r=a.$container.find(".fileinput-upload"),n=!r.hasClass("disabled")&&i.isEmpty(r.attr("disabled"));if(!e||!e.isDefaultPrevented()){if(!a.isUploadable)return void(n&&"submit"!==r.attr("type")&&(t=r.closest("form"),t.length&&t.trigger("submit"),e.preventDefault()));e.preventDefault(),n&&a.upload()}},_submitForm:function(){var e=this,i=e.$element,t=i.get(0).files;return t&&e.minFileCount>0&&e._getFileCount(t.length)<e.minFileCount?(e._noFilesError({}),!1):!e._abort({})},_clearPreview:function(){var t=this,a=t.$preview,r=t.showUploadedThumbs?a.find(i.FRAMES+":not(.file-preview-success)"):a.find(i.FRAMES);r.each(function(){var t=e(this);t.remove(),i.cleanZoomCache(a.find("#zoom-"+t.attr("id")))}),t.$preview.find(i.FRAMES).length&&t.showPreview||t._resetUpload(),t._validateDefaultPreview()},_initSortable:function(){var t,a=this,r=a.$preview,n="."+i.SORT_CSS;window.KvSortable&&0!==r.find(n).length&&(t={handle:".drag-handle-init",dataIdAttr:"data-preview-id",draggable:n,onSort:function(t){var r,n,o=t.oldIndex,l=t.newIndex;a.initialPreview=i.moveArray(a.initialPreview,o,l),a.initialPreviewConfig=i.moveArray(a.initialPreviewConfig,o,l),a.previewCache.init();for(var s=0;s<a.initialPreviewConfig.length;s++)null!==a.initialPreviewConfig[s]&&(r=a.initialPreviewConfig[s].key,n=e(".kv-file-remove[data-key='"+r+"']").closest(i.FRAMES),n.attr("data-fileindex","init_"+s).data("fileindex","init_"+s));a._raise("filesorted",{previewId:e(t.item).attr("id"),oldIndex:o,newIndex:l,stack:a.initialPreviewConfig})}},r.data("kvsortable")&&r.kvsortable("destroy"),e.extend(!0,t,a.fileActionSettings.dragSettings),r.kvsortable(t))},_initPreview:function(e){var t,a=this,r=a.initialCaption||"";return a.previewCache.count()?(t=a.previewCache.out(),r=e&&a.initialCaption?a.initialCaption:t.caption,a.$preview.html(t.content),a._setInitThumbAttr(),a._setCaption(r),a._initSortable(),void(i.isEmpty(t.content)||a.$container.removeClass("file-input-new"))):(a._clearPreview(),void(e?a._setCaption(r):a._initCaption()))},_getZoomButton:function(e){var i=this,t=i.previewZoomButtonIcons[e],a=i.previewZoomButtonClasses[e],r=' title="'+(i.previewZoomButtonTitles[e]||"")+'" ',n=r+("close"===e?' data-dismiss="modal" aria-hidden="true"':"");return"fullscreen"!==e&&"borderless"!==e&&"toggleheader"!==e||(n+=' data-toggle="button" aria-pressed="false" autocomplete="off"'),'<button type="button" class="'+a+" btn-"+e+'"'+n+">"+t+"</button>"},_getModalContent:function(){var e=this;return e._getLayoutTemplate("modal").replace(/\{zoomFrameClass}/g,e.frameClass).replace(/\{heading}/g,e.msgZoomModalHeading).replace(/\{prev}/g,e._getZoomButton("prev")).replace(/\{next}/g,e._getZoomButton("next")).replace(/\{toggleheader}/g,e._getZoomButton("toggleheader")).replace(/\{fullscreen}/g,e._getZoomButton("fullscreen")).replace(/\{borderless}/g,e._getZoomButton("borderless")).replace(/\{close}/g,e._getZoomButton("close"))},_listenModalEvent:function(e){var t=this,a=t.$modal,r=function(e){return{sourceEvent:e,previewId:a.data("previewId"),modal:a}};a.on(e+".bs.modal",function(n){var o=a.find(".btn-fullscreen"),l=a.find(".btn-borderless");t._raise("filezoom"+e,r(n)),"shown"===e&&(l.removeClass("active").attr("aria-pressed","false"),o.removeClass("active").attr("aria-pressed","false"),a.hasClass("file-zoom-fullscreen")&&(t._maximizeZoomDialog(),i.checkFullScreen()?o.addClass("active").attr("aria-pressed","true"):l.addClass("active").attr("aria-pressed","true")))})},_initZoom:function(){var t,a=this,r=a._getLayoutTemplate("modalMain"),n="#"+i.MODAL_ID;a.showPreview&&(a.$modal=e(n),a.$modal&&a.$modal.length||(t=e(document.createElement("div")).html(r).insertAfter(a.$container),a.$modal=e(n).insertBefore(t),t.remove()),i.initModal(a.$modal),a.$modal.html(a._getModalContent()),e.each(i.MODAL_EVENTS,function(e,i){a._listenModalEvent(i)}))},_initZoomButtons:function(){var t,a,r=this,n=r.$modal.data("previewId")||"",o=r.$preview,l=o.find(i.FRAMES).toArray(),s=l.length,d=r.$modal.find(".btn-prev"),c=r.$modal.find(".btn-next");return l.length<2?(d.hide(),void c.hide()):(d.show(),c.show(),void(s&&(t=e(l[0]),a=e(l[s-1]),d.removeAttr("disabled"),c.removeAttr("disabled"),t.length&&t.attr("id")===n&&d.attr("disabled",!0),a.length&&a.attr("id")===n&&c.attr("disabled",!0))))},_maximizeZoomDialog:function(){var i=this,t=i.$modal,a=t.find(".modal-header:visible"),r=t.find(".modal-footer:visible"),n=t.find(".modal-body"),o=e(window).height(),l=0;t.addClass("file-zoom-fullscreen"),a&&a.length&&(o-=a.outerHeight(!0)),r&&r.length&&(o-=r.outerHeight(!0)),n&&n.length&&(l=n.outerHeight(!0)-n.height(),o-=l),t.find(".kv-zoom-body").height(o)},_resizeZoomDialog:function(e){var t=this,a=t.$modal,r=a.find(".btn-fullscreen"),n=a.find(".btn-borderless");if(a.hasClass("file-zoom-fullscreen"))i.toggleFullScreen(!1),e?r.hasClass("active")||(a.removeClass("file-zoom-fullscreen"),t._resizeZoomDialog(!0),n.hasClass("active")&&n.removeClass("active").attr("aria-pressed","false")):r.hasClass("active")?r.removeClass("active").attr("aria-pressed","false"):(a.removeClass("file-zoom-fullscreen"),t.$modal.find(".kv-zoom-body").css("height",t.zoomModalHeight));else{if(!e)return void t._maximizeZoomDialog();i.toggleFullScreen(!0)}a.focus()},_setZoomContent:function(t,a){var r,n,o,l,s,d,c,p,u,f,m=this,g=t.attr("id"),v=m.$modal,h=v.find(".btn-prev"),w=v.find(".btn-next"),_=v.find(".btn-fullscreen"),b=v.find(".btn-borderless"),C=v.find(".btn-toggleheader"),y=m.$preview.find("#zoom-"+g);n=y.attr("data-template")||"generic",r=y.find(".kv-file-content"),o=r.length?r.html():"",u=t.data("caption")||"",f=t.data("size")||"",l=u+" "+f,v.find(".kv-zoom-title").html(l),s=v.find(".kv-zoom-body"),v.removeClass("kv-single-content"),a?(p=s.addClass("file-thumb-loading").clone().insertAfter(s),s.html(o).hide(),p.fadeOut("fast",function(){s.fadeIn("fast",function(){s.removeClass("file-thumb-loading")}),p.remove()})):s.html(o),c=m.previewZoomSettings[n],c&&(d=s.find(".kv-preview-data"),i.addCss(d,"file-zoom-detail"),e.each(c,function(e,i){d.css(e,i),(d.attr("width")&&"width"===e||d.attr("height")&&"height"===e)&&d.removeAttr(e)})),v.data("previewId",g),m._handler(h,"click",function(){m._zoomSlideShow("prev",g)}),m._handler(w,"click",function(){m._zoomSlideShow("next",g);
}),m._handler(_,"click",function(){m._resizeZoomDialog(!0)}),m._handler(b,"click",function(){m._resizeZoomDialog(!1)}),m._handler(C,"click",function(){var e,i=v.find(".modal-header"),t=v.find(".modal-body .floating-buttons"),a=i.find(".kv-zoom-actions"),r=function(e){var t=m.$modal.find(".kv-zoom-body"),a=m.zoomModalHeight;v.hasClass("file-zoom-fullscreen")&&(a=t.outerHeight(!0),e||(a-=i.outerHeight(!0))),t.css("height",e?a+e:a)};i.is(":visible")?(e=i.outerHeight(!0),i.slideUp("slow",function(){a.find(".btn").appendTo(t),r(e)})):(t.find(".btn").appendTo(a),i.slideDown("slow",function(){r()})),v.focus()}),m._handler(v,"keydown",function(e){var i=e.which||e.keyCode;37!==i||h.attr("disabled")||m._zoomSlideShow("prev",g),39!==i||w.attr("disabled")||m._zoomSlideShow("next",g)})},_zoomPreview:function(e){var t,a=this,r=a.$modal;if(!e.length)throw"Cannot zoom to detailed preview!";i.initModal(r),r.html(a._getModalContent()),t=e.closest(i.FRAMES),a._setZoomContent(t),r.modal("show"),a._initZoomButtons()},_zoomSlideShow:function(t,a){var r,n,o,l=this,s=l.$modal.find(".kv-zoom-actions .btn-"+t),d=l.$preview.find(i.FRAMES).toArray(),c=d.length;if(!s.attr("disabled")){for(n=0;c>n;n++)if(e(d[n]).attr("id")===a){o="prev"===t?n-1:n+1;break}0>o||o>=c||!d[o]||(r=e(d[o]),r.length&&l._setZoomContent(r,!0),l._initZoomButtons(),l._raise("filezoom"+t,{previewId:a,modal:l.$modal}))}},_initZoomButton:function(){var i=this;i.$preview.find(".kv-file-zoom").each(function(){var t=e(this);i._handler(t,"click",function(){i._zoomPreview(t)})})},_clearObjects:function(i){i.find("video audio").each(function(){this.pause(),e(this).remove()}),i.find("img object div").each(function(){e(this).remove()})},_clearFileInput:function(){var t,a,r,n=this,o=n.$element;n.fileInputCleared=!0,i.isEmpty(o.val())||(n.isIE9||n.isIE10?(t=o.closest("form"),a=e(document.createElement("form")),r=e(document.createElement("div")),o.before(r),t.length?t.after(a):r.after(a),a.append(o).trigger("reset"),r.before(o).remove(),a.remove()):o.val(""))},_resetUpload:function(){var e=this;e.uploadCache={content:[],config:[],tags:[],append:!0},e.uploadCount=0,e.uploadStatus={},e.uploadLog=[],e.uploadAsyncCount=0,e.loadedImages=[],e.totalImagesCount=0,e.$btnUpload.removeAttr("disabled"),e._setProgress(0),i.addCss(e.$progress,"hide"),e._resetErrors(!1),e.ajaxAborted=!1,e.ajaxRequests=[],e._resetCanvas(),e.cacheInitialPreview={},e.overwriteInitial&&(e.initialPreview=[],e.initialPreviewConfig=[],e.initialPreviewThumbTags=[],e.previewCache.data={content:[],config:[],tags:[]})},_resetCanvas:function(){var e=this;e.canvas&&e.imageCanvasContext&&e.imageCanvasContext.clearRect(0,0,e.canvas.width,e.canvas.height)},_hasInitialPreview:function(){var e=this;return!e.overwriteInitial&&e.previewCache.count()},_resetPreview:function(){var e,i,t=this;t.previewCache.count()?(e=t.previewCache.out(),t.$preview.html(e.content),t._setInitThumbAttr(),i=t.initialCaption?t.initialCaption:e.caption,t._setCaption(i)):(t._clearPreview(),t._initCaption()),t.showPreview&&(t._initZoom(),t._initSortable())},_clearDefaultPreview:function(){var e=this;e.$preview.find(".file-default-preview").remove()},_validateDefaultPreview:function(){var e=this;e.showPreview&&!i.isEmpty(e.defaultPreviewContent)&&(e.$preview.html('<div class="file-default-preview">'+e.defaultPreviewContent+"</div>"),e.$container.removeClass("file-input-new"),e._initClickable())},_resetPreviewThumbs:function(e){var i,t=this;return e?(t._clearPreview(),void t.clearStack()):void(t._hasInitialPreview()?(i=t.previewCache.out(),t.$preview.html(i.content),t._setInitThumbAttr(),t._setCaption(i.caption),t._initPreviewActions()):t._clearPreview())},_getLayoutTemplate:function(e){var t=this,a=t.layoutTemplates[e];return i.isEmpty(t.customLayoutTags)?a:i.replaceTags(a,t.customLayoutTags)},_getPreviewTemplate:function(e){var t=this,a=t.previewTemplates[e];return i.isEmpty(t.customPreviewTags)?a:i.replaceTags(a,t.customPreviewTags)},_getOutData:function(e,i,t){var a=this;return e=e||{},i=i||{},t=t||a.filestack.slice(0)||{},{form:a.formdata,files:t,filenames:a.filenames,filescount:a.getFilesCount(),extra:a._getExtraData(),response:i,reader:a.reader,jqXHR:e}},_getMsgSelected:function(e){var i=this,t=1===e?i.fileSingle:i.filePlural;return e>0?i.msgSelected.replace("{n}",e).replace("{files}",t):i.msgNoFilesSelected},_getThumbs:function(e){return e=e||"",this.$preview.find(i.FRAMES+":not(.file-preview-initial)"+e)},_getExtraData:function(e,i){var t=this,a=t.uploadExtraData;return"function"==typeof t.uploadExtraData&&(a=t.uploadExtraData(e,i)),a},_initXhr:function(e,i,t){var a=this;return e.upload&&e.upload.addEventListener("progress",function(e){var r=0,n=e.total,o=e.loaded||e.position;e.lengthComputable&&(r=Math.floor(o/n*100)),i?a._setAsyncUploadStatus(i,r,t):a._setProgress(r)},!1),e},_ajaxSubmit:function(i,t,a,r,n,o){var l,s=this;s._raise("filepreajax",[n,o])&&(s._uploadExtra(n,o),l=e.extend(!0,{},{xhr:function(){var i=e.ajaxSettings.xhr();return s._initXhr(i,n,s.getFileStack().length)},url:s.uploadUrl,type:"POST",dataType:"json",data:s.formdata,cache:!1,processData:!1,contentType:!1,beforeSend:i,success:t,complete:a,error:r},s.ajaxSettings),s.ajaxRequests.push(e.ajax(l)))},_mergeArray:function(e,t){var a=this,r=i.cleanArray(a[e]),n=i.cleanArray(t);a[e]=r.concat(n)},_initUploadSuccess:function(t,a,r){var n,o,l,s,d,c,p,u,f,m=this;m.showPreview&&"object"==typeof t&&!e.isEmptyObject(t)&&void 0!==t.initialPreview&&t.initialPreview.length>0&&(m.hasInitData=!0,c=t.initialPreview||[],p=t.initialPreviewConfig||[],u=t.initialPreviewThumbTags||[],n=!(void 0!==t.append&&!t.append),c.length>0&&!i.isArray(c)&&(c=c.split(m.initialPreviewDelimiter)),m._mergeArray("initialPreview",c),m._mergeArray("initialPreviewConfig",p),m._mergeArray("initialPreviewThumbTags",u),void 0!==a?r?(f=a.attr("data-fileindex"),m.uploadCache.content[f]=c[0],m.uploadCache.config[f]=p[0]||[],m.uploadCache.tags[f]=u[0]||[],m.uploadCache.append=n):(l=m.previewCache.add(c,p[0],u[0],n),o=m.previewCache.get(l,!1),s=e(document.createElement("div")).html(o).hide().insertAfter(a),d=s.find(".kv-zoom-cache"),d&&d.length&&d.insertAfter(a),a.fadeOut("slow",function(){var e=s.find(".file-preview-frame");e&&e.length&&e.insertBefore(a).fadeIn("slow").css("display:inline-block"),m._initPreviewActions(),m._clearFileInput(),i.cleanZoomCache(m.$preview.find("#zoom-"+a.attr("id"))),a.remove(),s.remove(),m._initSortable()})):(m.previewCache.set(c,p,u,n),m._initPreview(),m._initPreviewActions()))},_initSuccessThumbs:function(){var t=this;t.showPreview&&t._getThumbs(i.FRAMES+".file-preview-success").each(function(){var a=e(this),r=t.$preview,n=a.find(".kv-file-remove");n.removeAttr("disabled"),t._handler(n,"click",function(){var e=a.attr("id"),n=t._raise("filesuccessremove",[e,a.data("fileindex")]);i.cleanMemory(a),n!==!1&&a.fadeOut("slow",function(){i.cleanZoomCache(r.find("#zoom-"+e)),a.remove(),r.find(i.FRAMES).length||t.reset()})})})},_checkAsyncComplete:function(){var i,t,a=this;for(t=0;t<a.filestack.length;t++)if(a.filestack[t]&&(i=a.previewInitId+"-"+t,-1===e.inArray(i,a.uploadLog)))return!1;return a.uploadAsyncCount===a.uploadLog.length},_uploadExtra:function(i,t){var a=this,r=a._getExtraData(i,t);0!==r.length&&e.each(r,function(e,i){a.formdata.append(e,i)})},_uploadSingle:function(t,a,r){var n,o,l,s,d,c,p,u,f,m,g=this,v=g.getFileStack().length,h=new FormData,w=g.previewInitId+"-"+t,_=g.filestack.length>0||!e.isEmptyObject(g.uploadExtraData),b=e("#"+w).find(".file-thumb-progress"),C={id:w,index:t};g.formdata=h,g.showPreview&&(o=e("#"+w+":not(.file-preview-initial)"),s=o.find(".kv-file-upload"),d=o.find(".kv-file-remove"),b.removeClass("hide")),0===v||!_||s&&s.hasClass("disabled")||g._abort(C)||(m=function(e,i){g.updateStack(e,void 0),g.uploadLog.push(i),g._checkAsyncComplete()&&(g.fileBatchCompleted=!0)},l=function(){var e,t,a,r=g.uploadCache,n=0,o=g.cacheInitialPreview;g.fileBatchCompleted&&(o&&o.content&&(n=o.content.length),setTimeout(function(){if(g.showPreview){if(g.previewCache.set(r.content,r.config,r.tags,r.append),n){for(t=0;t<r.content.length;t++)a=t+n,o.content[a]=r.content[t],o.config.length&&(o.config[a]=r.config[t]),o.tags.length&&(o.tags[a]=r.tags[t]);g.initialPreview=i.cleanArray(o.content),g.initialPreviewConfig=i.cleanArray(o.config),g.initialPreviewThumbTags=i.cleanArray(o.tags)}else g.initialPreview=r.content,g.initialPreviewConfig=r.config,g.initialPreviewThumbTags=r.tags;g.cacheInitialPreview={},g.hasInitData&&(g._initPreview(),g._initPreviewActions())}g.unlock(),g._clearFileInput(),e=g.$preview.find(".file-preview-initial"),g.uploadAsync&&e.length&&(i.addCss(e,i.SORT_CSS),g._initSortable()),g._raise("filebatchuploadcomplete",[g.filestack,g._getExtraData()]),g.uploadCount=0,g.uploadStatus={},g.uploadLog=[],g._setProgress(101)},100))},c=function(a){n=g._getOutData(a),g.fileBatchCompleted=!1,g.showPreview&&(o.hasClass("file-preview-success")||(g._setThumbStatus(o,"Loading"),i.addCss(o,"file-uploading")),s.attr("disabled",!0),d.attr("disabled",!0)),r||g.lock(),g._raise("filepreupload",[n,w,t]),e.extend(!0,C,n),g._abort(C)&&(a.abort(),g._setProgressCancelled())},p=function(a,l,d){var c=g.showPreview&&o.attr("id")?o.attr("id"):w;n=g._getOutData(d,a),e.extend(!0,C,n),setTimeout(function(){i.isEmpty(a)||i.isEmpty(a.error)?(g.showPreview&&(g._setThumbStatus(o,"Success"),s.hide(),g._initUploadSuccess(a,o,r),g._setProgress(101,b)),g._raise("fileuploaded",[n,c,t]),r?m(t,c):g.updateStack(t,void 0)):(g._showUploadError(a.error,C),g._setPreviewError(o,t),r&&m(t,c))},100)},u=function(){setTimeout(function(){g.showPreview&&(s.removeAttr("disabled"),d.removeAttr("disabled"),o.removeClass("file-uploading")),r?l():(g.unlock(!1),g._clearFileInput()),g._initSuccessThumbs()},100)},f=function(i,n,l){var s=g.ajaxOperations.uploadThumb,d=g._parseError(s,i,l,r?a[t].name:null);setTimeout(function(){r&&m(t,w),g.uploadStatus[w]=100,g._setPreviewError(o,t),e.extend(!0,C,g._getOutData(i)),g._setProgress(101,b,g.msgAjaxProgressError.replace("{operation}",s)),g._showUploadError(d,C)},100)},h.append(g.uploadFileAttr,a[t],g.filenames[t]),h.append("file_id",t),g._ajaxSubmit(c,p,u,f,w,t))},_uploadBatch:function(){var t,a,r,n,o,l=this,s=l.filestack,d=s.length,c={},p=l.filestack.length>0||!e.isEmptyObject(l.uploadExtraData);l.formdata=new FormData,0!==d&&p&&!l._abort(c)&&(o=function(){e.each(s,function(e){l.updateStack(e,void 0)}),l._clearFileInput()},t=function(t){l.lock();var a=l._getOutData(t);l.showPreview&&l._getThumbs().each(function(){var t=e(this),a=t.find(".kv-file-upload"),r=t.find(".kv-file-remove");t.hasClass("file-preview-success")||(l._setThumbStatus(t,"Loading"),i.addCss(t,"file-uploading")),a.attr("disabled",!0),r.attr("disabled",!0)}),l._raise("filebatchpreupload",[a]),l._abort(a)&&(t.abort(),l._setProgressCancelled())},a=function(t,a,r){var n=l._getOutData(r,t),s=l._getThumbs(":not(.file-preview-error)"),d=0,c=i.isEmpty(t)||i.isEmpty(t.errorkeys)?[]:t.errorkeys;i.isEmpty(t)||i.isEmpty(t.error)?(l._raise("filebatchuploadsuccess",[n]),o(),l.showPreview?(s.each(function(){var i=e(this),t=i.find(".kv-file-upload");i.find(".kv-file-upload").hide(),l._setThumbStatus(i,"Success"),i.removeClass("file-uploading"),t.removeAttr("disabled")}),l._initUploadSuccess(t)):l.reset(),l._setProgress(101)):(l.showPreview&&(s.each(function(){var i=e(this),t=i.find(".kv-file-remove"),a=i.find(".kv-file-upload");return i.removeClass("file-uploading"),a.removeAttr("disabled"),t.removeAttr("disabled"),0===c.length?void l._setPreviewError(i):(-1!==e.inArray(d,c)?l._setPreviewError(i):(i.find(".kv-file-upload").hide(),l._setThumbStatus(i,"Success"),l.updateStack(d,void 0)),void d++)}),l._initUploadSuccess(t)),l._showUploadError(t.error,n,"filebatchuploaderror"))},n=function(){l.unlock(),l._initSuccessThumbs(),l._clearFileInput(),l._raise("filebatchuploadcomplete",[l.filestack,l._getExtraData()])},r=function(i,t,a){var r=l._getOutData(i),n=l.ajaxOperations.uploadBatch,o=l._parseError(n,i,a);l._showUploadError(o,r,"filebatchuploaderror"),l.uploadFileCount=d-1,l.showPreview&&(l._getThumbs().each(function(){var i=e(this),t=i.attr("data-fileindex");i.removeClass("file-uploading"),void 0!==l.filestack[t]&&l._setPreviewError(i)}),l._getThumbs().removeClass("file-uploading"),l._getThumbs(" .kv-file-upload").removeAttr("disabled"),l._getThumbs(" .kv-file-delete").removeAttr("disabled"),l._setProgress(101,l.$progress,l.msgAjaxProgressError.replace("{operation}",n)))},e.each(s,function(e,t){i.isEmpty(s[e])||l.formdata.append(l.uploadFileAttr,t,l.filenames[e])}),l._ajaxSubmit(t,a,n,r))},_uploadExtraOnly:function(){var e,t,a,r,n=this,o={};n.formdata=new FormData,n._abort(o)||(e=function(e){n.lock();var i=n._getOutData(e);n._raise("filebatchpreupload",[i]),n._setProgress(50),o.data=i,o.xhr=e,n._abort(o)&&(e.abort(),n._setProgressCancelled())},t=function(e,t,a){var r=n._getOutData(a,e);i.isEmpty(e)||i.isEmpty(e.error)?(n._raise("filebatchuploadsuccess",[r]),n._clearFileInput(),n._initUploadSuccess(e),n._setProgress(101)):n._showUploadError(e.error,r,"filebatchuploaderror")},a=function(){n.unlock(),n._clearFileInput(),n._raise("filebatchuploadcomplete",[n.filestack,n._getExtraData()])},r=function(e,i,t){var a=n._getOutData(e),r=n.ajaxOperations.uploadExtra,l=n._parseError(r,e,t);o.data=a,n._showUploadError(l,a,"filebatchuploaderror"),n._setProgress(101,n.$progress,n.msgAjaxProgressError.replace("{operation}",r))},n._ajaxSubmit(e,t,a,r))},_deleteFileIndex:function(t){var a=this,r=t.attr("data-fileindex");"init_"===r.substring(0,5)&&(r=parseInt(r.replace("init_","")),a.initialPreview=i.spliceArray(a.initialPreview,r),a.initialPreviewConfig=i.spliceArray(a.initialPreviewConfig,r),a.initialPreviewThumbTags=i.spliceArray(a.initialPreviewThumbTags,r),a.$preview.find(i.FRAMES).each(function(){var i=e(this),t=i.attr("data-fileindex");"init_"===t.substring(0,5)&&(t=parseInt(t.replace("init_","")),t>r&&(t--,i.attr("data-fileindex","init_"+t)))}),a.uploadAsync&&(a.cacheInitialPreview=a.getPreview()))},_initFileActions:function(){var t=this,a=t.$preview;t.showPreview&&(t._initZoomButton(),a.find(i.FRAMES+" .kv-file-remove").each(function(){var r,n,o,l,s=e(this),d=s.closest(i.FRAMES),c=d.attr("id"),p=d.attr("data-fileindex");t._handler(s,"click",function(){return l=t._raise("filepreremove",[c,p]),l!==!1&&t._validateMinCount()?(r=d.hasClass("file-preview-error"),i.cleanMemory(d),void d.fadeOut("slow",function(){i.cleanZoomCache(a.find("#zoom-"+c)),t.updateStack(p,void 0),t._clearObjects(d),d.remove(),c&&r&&t.$errorContainer.find('li[data-file-id="'+c+'"]').fadeOut("fast",function(){e(this).remove(),t._errorsExist()||t._resetErrors()}),t._clearFileInput();var l=t.getFileStack(!0),s=t.previewCache.count(),u=l.length,f=t.showPreview&&a.find(i.FRAMES).length;0!==u||0!==s||f?(n=s+u,o=n>1?t._getMsgSelected(n):l[0]?t._getFileNames()[0]:"",t._setCaption(o)):t.reset(),t._raise("fileremoved",[c,p])})):!1})}),t.$preview.find(i.FRAMES+" .kv-file-upload").each(function(){var a=e(this);t._handler(a,"click",function(){var e=a.closest(i.FRAMES),r=e.attr("data-fileindex");e.hasClass("file-preview-error")||t._uploadSingle(r,t.filestack,!1)})}))},_initPreviewActions:function(){var t=this,a=t.$preview,r=t.deleteExtraData||{},n=i.FRAMES+" .kv-file-remove",o=function(){var e=t.isUploadable?t.previewCache.count():t.$element.get(0).files.length;0!==a.find(n).length||e||(t.reset(),t.initialCaption="")};t._initZoomButton(),a.find(n).each(function(){var n=e(this),l=n.data("url")||t.deleteUrl,s=n.data("key");if(!i.isEmpty(l)&&void 0!==s){var d,c,p,u,f=n.closest(i.FRAMES),m=t.previewCache.data,g=f.data("fileindex");g=parseInt(g.replace("init_","")),p=i.isEmpty(m.config)&&i.isEmpty(m.config[g])?null:m.config[g],u=i.isEmpty(p)||i.isEmpty(p.extra)?r:p.extra,"function"==typeof u&&(u=u()),c={id:n.attr("id"),key:s,extra:u},d=e.extend(!0,{},{url:l,type:"POST",dataType:"json",data:e.extend(!0,{},{key:s},u),beforeSend:function(e){t.ajaxAborted=!1,t._raise("filepredelete",[s,e,u]),t.ajaxAborted?e.abort():(i.addCss(f,"file-uploading"),i.addCss(n,"disabled"))},success:function(e,r,l){var d,p;return i.isEmpty(e)||i.isEmpty(e.error)?(t.previewCache.init(),g=parseInt(f.data("fileindex").replace("init_","")),t.previewCache.unset(g),d=t.previewCache.count(),p=d>0?t._getMsgSelected(d):"",t._deleteFileIndex(f),t._setCaption(p),t._raise("filedeleted",[s,l,u]),f.removeClass("file-uploading").addClass("file-deleted"),void f.fadeOut("slow",function(){i.cleanZoomCache(a.find("#zoom-"+f.attr("id"))),t._clearObjects(f),f.remove(),o(),d||0!==t.getFileStack().length||(t._setCaption(""),t.reset())})):(c.jqXHR=l,c.response=e,t._showError(e.error,c,"filedeleteerror"),f.removeClass("file-uploading"),n.removeClass("disabled"),void o())},error:function(e,i,a){var r=t.ajaxOperations.deleteThumb,n=t._parseError(r,e,a);c.jqXHR=e,c.response={},t._showError(n,c,"filedeleteerror"),f.removeClass("file-uploading"),o()}},t.ajaxDeleteSettings),t._handler(n,"click",function(){return t._validateMinCount()?void e.ajax(d):!1})}})},_hideFileIcon:function(){this.overwriteInitial&&this.$captionContainer.find(".kv-caption-icon").hide()},_showFileIcon:function(){this.$captionContainer.find(".kv-caption-icon").show()},_getSize:function(i){var t,a,r,n=this,o=parseFloat(i),l=n.fileSizeGetter;return e.isNumeric(i)&&e.isNumeric(o)?("function"==typeof l?r=l(o):0===o?r="0.00 B":(t=Math.floor(Math.log(o)/Math.log(1024)),a=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],r=1*(o/Math.pow(1024,t)).toFixed(2)+" "+a[t]),n._getLayoutTemplate("size").replace("{sizeText}",r)):""},_generatePreviewTemplate:function(t,a,r,n,o,l,s,d,c,p,u){var f,m=this,g=m.slug(r),v="",h=m.previewSettings[t]||m.defaults.previewSettings[t],w=h&&h.width?h.width:"",_=h&&h.height?h.height:"",b=c||m._renderFileFooter(g,s,i.isEmpty(w)?"auto":w,l),C=m._getPreviewIcon(r),y="type-default",E=C&&m.preferIconicPreview,x=C&&m.preferIconicZoomPreview,T=function(a,l,s,c){var f=s?"zoom-"+o:o,v=m._getPreviewTemplate(a),h=(d||"")+" "+c;return m.frameClass&&(h=m.frameClass+" "+h),s&&(h=h.replace(" "+i.SORT_CSS,"")),v=m._parseFilePreviewIcon(v,r),"text"===a&&(l=i.htmlEncode(l)),"object"!==t||n||e.each(m.defaults.fileTypeSettings,function(e,i){"object"!==e&&"other"!==e&&i(r,n)&&(y="type-"+e)}),v.replace(/\{previewId}/g,f).replace(/\{caption}/g,g).replace(/\{frameClass}/g,h).replace(/\{type}/g,n).replace(/\{fileindex}/g,p).replace(/\{width}/g,w).replace(/\{height}/g,_).replace(/\{typeCss}/g,y).replace(/\{footer}/g,b).replace(/\{data}/g,l).replace(/\{template}/g,u||t)};return p=p||o.slice(o.lastIndexOf("-")+1),m.fileActionSettings.showZoom&&(v=T(x?"other":t,a,!0,"kv-zoom-thumb")),v="\n"+m._getLayoutTemplate("zoomCache").replace("{zoomContent}",v),f=T(E?"other":t,a,!1,"kv-preview-thumb"),f+v},_previewDefault:function(t,a,r){var n=this,o=n.$preview;if(n.showPreview){var l,s=t?t.name:"",d=t?t.type:"",c=t.size||0,p=n.slug(s),u=r===!0&&!n.isUploadable,f=i.objUrl.createObjectURL(t);n._clearDefaultPreview(),l=n._generatePreviewTemplate("other",f,s,d,a,u,c),o.append("\n"+l),n._setThumbAttr(a,p,c),r===!0&&n.isUploadable&&n._setThumbStatus(e("#"+a),"Error")}},_previewFile:function(e,i,t,a,r){if(this.showPreview){var n,o=this,l=o._parseFileType(i),s=i?i.name:"",d=o.slug(s),c=o.allowedPreviewTypes,p=o.allowedPreviewMimeTypes,u=o.$preview,f=c&&c.indexOf(l)>=0,m=i.size||0,g="text"===l||"html"===l||"image"===l?t.target.result:r,v=p&&-1!==p.indexOf(i.type);"html"===l&&o.purifyHtml&&window.DOMPurify&&(g=window.DOMPurify.sanitize(g)),f||v?(n=o._generatePreviewTemplate(l,g,s,i.type,a,!1,m),o._clearDefaultPreview(),u.append("\n"+n),o._validateImage(a,d,i.type,i.size)):o._previewDefault(i,a),o._setThumbAttr(a,d,m),o._initSortable()}},_setThumbAttr:function(i,t,a){var r=this,n=e("#"+i);n.length&&(a=a&&a>0?r._getSize(a):"",n.data({caption:t,size:a}))},_setInitThumbAttr:function(){var e,t,a,r,n=this,o=n.previewCache.data,l=n.previewCache.count(!0);if(0!==l)for(var s=0;l>s;s++)e=o.config[s],r=n.previewInitId+"-init_"+s,t=i.ifSet("caption",e,i.ifSet("filename",e)),a=i.ifSet("size",e),n._setThumbAttr(r,t,a)},_slugDefault:function(e){return i.isEmpty(e)?"":String(e).replace(/[\-\[\]\/\{}:;#%=\(\)\*\+\?\\\^\$\|<>&"']/g,"_")},_readFiles:function(t){this.reader=new FileReader;var a,r=this,n=r.$element,o=r.$preview,l=r.reader,s=r.$previewContainer,d=r.$previewStatus,c=r.msgLoading,p=r.msgProgress,u=r.previewInitId,f=t.length,m=r.fileTypeSettings,g=r.filestack.length,v=r.allowedFileTypes,h=v?v.length:0,w=r.allowedFileExtensions,_=i.isEmpty(w)?"":w.join(", "),b=r.maxFilePreviewSize&&parseFloat(r.maxFilePreviewSize),C=o.length&&(!b||isNaN(b)),y=function(i,n,o,l){var s=e.extend(!0,{},r._getOutData({},{},t),{id:o,index:l}),d={id:o,index:l,file:n,files:t};return r._previewDefault(n,o,!0),r.isUploadable&&(r.addToStack(void 0),setTimeout(function(){a(l+1)},100)),r._initFileActions(),r.removeFromPreviewOnError&&e("#"+o).remove(),r.isUploadable?r._showUploadError(i,s):r._showError(i,d)};r.loadedImages=[],r.totalImagesCount=0,e.each(t,function(e,i){var t=r.fileTypeSettings.image;t&&t(i.type)&&r.totalImagesCount++}),a=function(e){if(i.isEmpty(n.attr("multiple"))&&(f=1),e>=f)return r.isUploadable&&r.filestack.length>0?r._raise("filebatchselected",[r.getFileStack()]):r._raise("filebatchselected",[t]),s.removeClass("file-thumb-loading"),void d.html("");var E,x,T,S,F,I,P,k,z,A,$=g+e,D=u+"-"+$,U=t[e],j=U.name?r.slug(U.name):"",R=(U.size||0)/1e3,M="",L=i.objUrl.createObjectURL(U),Z=0,O="";if(h>0)for(S=0;h>S;S++)k=v[S],z=r.msgFileTypes[k]||k,O+=0===S?z:", "+z;if(j===!1)return void a(e+1);if(0===j.length)return F=r.msgInvalidFileName.replace("{name}",i.htmlEncode(U.name)),void(r.isError=y(F,U,D,e));if(i.isEmpty(w)||(M=new RegExp("\\.("+w.join("|")+")$","i")),T=R.toFixed(2),r.maxFileSize>0&&R>r.maxFileSize)return F=r.msgSizeTooLarge.replace("{name}",j).replace("{size}",T).replace("{maxSize}",r.maxFileSize),void(r.isError=y(F,U,D,e));if(null!==r.minFileSize&&R<=i.getNum(r.minFileSize))return F=r.msgSizeTooSmall.replace("{name}",j).replace("{size}",T).replace("{minSize}",r.minFileSize),void(r.isError=y(F,U,D,e));if(!i.isEmpty(v)&&i.isArray(v)){for(S=0;S<v.length;S+=1)I=v[S],A=m[I],Z+=A&&"function"==typeof A&&A(U.type,U.name)?1:0;if(0===Z)return F=r.msgInvalidFileType.replace("{name}",j).replace("{types}",O),void(r.isError=y(F,U,D,e))}return 0!==Z||i.isEmpty(w)||!i.isArray(w)||i.isEmpty(M)||(P=i.compare(j,M),Z+=i.isEmpty(P)?0:P.length,0!==Z)?r.showPreview?!C&&R>b?(r.addToStack(U),s.addClass("file-thumb-loading"),r._previewDefault(U,D),r._initFileActions(),r._updateFileDetails(f),void a(e+1)):(o.length&&void 0!==FileReader?(d.html(c.replace("{index}",e+1).replace("{files}",f)),s.addClass("file-thumb-loading"),l.onerror=function(e){r._errorHandler(e,j)},l.onload=function(i){r._previewFile(e,U,i,D,L),r._initFileActions()},l.onloadend=function(){F=p.replace("{index}",e+1).replace("{files}",f).replace("{percent}",50).replace("{name}",j),setTimeout(function(){d.html(F),r._updateFileDetails(f),a(e+1)},100),r._raise("fileloaded",[U,D,e,l])},l.onprogress=function(i){if(i.lengthComputable){var t=i.loaded/i.total*100,a=Math.ceil(t);F=p.replace("{index}",e+1).replace("{files}",f).replace("{percent}",a).replace("{name}",j),setTimeout(function(){d.html(F)},100)}},E=m.text,x=m.image,E(U.type,j)?l.readAsText(U,r.textEncoding):x(U.type,j)?l.readAsDataURL(U):l.readAsArrayBuffer(U)):(r._previewDefault(U,D),setTimeout(function(){a(e+1),r._updateFileDetails(f)},100),r._raise("fileloaded",[U,D,e,l])),void r.addToStack(U)):(r.addToStack(U),setTimeout(function(){a(e+1)},100),void r._raise("fileloaded",[U,D,e,l])):(F=r.msgInvalidFileExtension.replace("{name}",j).replace("{extensions}",_),void(r.isError=y(F,U,D,e)))},a(0),r._updateFileDetails(f,!1)},_updateFileDetails:function(e){var t=this,a=t.$element,r=t.getFileStack(),n=i.isIE(9)&&i.findFileName(a.val())||a[0].files[0]&&a[0].files[0].name||r.length&&r[0].name||"",o=t.slug(n),l=t.isUploadable?r.length:e,s=t.previewCache.count()+l,d=l>1?t._getMsgSelected(s):o;t.isError?(t.$previewContainer.removeClass("file-thumb-loading"),t.$previewStatus.html(""),t.$captionContainer.find(".kv-caption-icon").hide()):t._showFileIcon(),t._setCaption(d,t.isError),t.$container.removeClass("file-input-new file-input-ajax-new"),1===arguments.length&&t._raise("fileselect",[e,o]),t.previewCache.count()&&t._initPreviewActions()},_setThumbStatus:function(e,i){var t=this;if(t.showPreview){var a="indicator"+i,r=a+"Title",n="file-preview-"+i.toLowerCase(),o=e.find(".file-upload-indicator"),l=t.fileActionSettings;e.removeClass("file-preview-success file-preview-error file-preview-loading"),"Error"===i&&e.find(".kv-file-upload").attr("disabled",!0),"Success"===i&&(e.find(".file-drag-handle").remove(),o.css("margin-left",0)),o.html(l[a]),o.attr("title",l[r]),e.addClass(n)}},_setProgressCancelled:function(){var e=this;e._setProgress(101,e.$progress,e.msgCancelled)},_setProgress:function(e,t,a){var r,n,o=this,l=Math.min(e,100),s=o.progressUploadThreshold,d=100>=e?o.progressTemplate:o.progressCompleteTemplate,c=100>l?o.progressTemplate:a?o.progressErrorTemplate:d;t=t||o.$progress,i.isEmpty(c)||(s&&l>s&&100>=e?r=c.replace(/\{percent}/g,s).replace(/\{status}/g,o.msgUploadThreshold):(n=e>100?o.msgUploadEnd:l+"%",r=c.replace(/\{percent}/g,l).replace(/\{status}/g,n)),t.html(r),a&&t.find('[role="progressbar"]').html(a))},_setFileDropZoneTitle:function(){var e,t=this,a=t.$container.find(".file-drop-zone"),r=t.dropZoneTitle;t.isClickable&&(e=i.isEmpty(t.$element.attr("multiple"))?t.fileSingle:t.filePlural,r+=t.dropZoneClickTitle.replace("{files}",e)),a.find("."+t.dropZoneTitleClass).remove(),t.isUploadable&&t.showPreview&&0!==a.length&&!(t.getFileStack().length>0)&&t.dropZoneEnabled&&(0===a.find(i.FRAMES).length&&i.isEmpty(t.defaultPreviewContent)&&a.prepend('<div class="'+t.dropZoneTitleClass+'">'+r+"</div>"),t.$container.removeClass("file-input-new"),i.addCss(t.$container,"file-input-ajax-new"))},_setAsyncUploadStatus:function(i,t,a){var r=this,n=0;r._setProgress(t,e("#"+i).find(".file-thumb-progress")),r.uploadStatus[i]=t,e.each(r.uploadStatus,function(e,i){n+=i}),r._setProgress(Math.floor(n/a))},_validateMinCount:function(){var e=this,i=e.isUploadable?e.getFileStack().length:e.$element.get(0).files.length;return e.validateInitialCount&&e.minFileCount>0&&e._getFileCount(i-1)<e.minFileCount?(e._noFilesError({}),!1):!0},_getFileCount:function(e){var i=this,t=0;return i.validateInitialCount&&!i.overwriteInitial&&(t=i.previewCache.count(),e+=t),e},_getFileId:function(e){var i,t=this,a=t.generateFileId;return"function"==typeof a?a(e,event):e?(i=e.webkitRelativePath||e.fileName||e.name||null,i?e.size+"-"+i.replace(/[^0-9a-zA-Z_-]/gim,""):null):null},_getFileName:function(e){return e&&e.name?this.slug(e.name):void 0},_getFileIds:function(e){var i=this;return i.fileids.filter(function(i){return e?void 0!==i:void 0!==i&&null!==i})},_getFileNames:function(e){var i=this;return i.filenames.filter(function(i){return e?void 0!==i:void 0!==i&&null!==i})},_setPreviewError:function(e,i,t){var a=this;void 0!==i&&a.updateStack(i,t),a.removeFromPreviewOnError?e.remove():a._setThumbStatus(e,"Error")},_checkDimensions:function(e,t,a,r,n,o,l){var s,d,c,p,u=this,f="Small"===t?"min":"max",m=u[f+"Image"+o];!i.isEmpty(m)&&a.length&&(c=a[0],d="Width"===o?c.naturalWidth||c.width:c.naturalHeight||c.height,p="Small"===t?d>=m:m>=d,p||(s=u["msgImage"+o+t].replace("{name}",n).replace("{size}",m),u._showUploadError(s,l),u._setPreviewError(r,e,null)))},_validateImage:function(e,i,t,a){var r,n,o,l=this,s=l.$preview,d=s.find("#"+e),c=d.attr("data-fileindex"),p=d.find("img");i=i||"Untitled",p.length&&l._handler(p,"load",function(){n=d.width(),o=s.width(),n>o&&(p.css("width","100%"),d.css("width","97%")),r={ind:c,id:e},l._checkDimensions(c,"Small",p,d,i,"Width",r),l._checkDimensions(c,"Small",p,d,i,"Height",r),l.resizeImage||(l._checkDimensions(c,"Large",p,d,i,"Width",r),l._checkDimensions(c,"Large",p,d,i,"Height",r)),l._raise("fileimageloaded",[e]),l.loadedImages.push({ind:c,img:p,thumb:d,pid:e,typ:t,siz:a,validated:!1}),l._validateAllImages()})},_validateAllImages:function(){var e,i,t,a=this,r={val:0},n=a.loadedImages.length,o=a.resizeIfSizeMoreThan;if(n===a.totalImagesCount&&(a._raise("fileimagesloaded"),a.resizeImage))for(e=0;e<a.loadedImages.length;e++)i=a.loadedImages[e],i.validated||(t=i.siz,t&&t>1e3*o&&a._getResizedImage(i,r,n),a.loadedImages[e].validated=!0)},_getResizedImage:function(i,t,a){var r,n,o,l,s=this,d=e(i.img)[0],c=d.naturalWidth,p=d.naturalHeight,u=1,f=s.maxImageWidth||c,m=s.maxImageHeight||p,g=!(!c||!p),v=s.imageCanvas,h=s.imageCanvasContext,w=i.typ,_=i.pid,b=i.ind,C=i.thumb;if(o=function(e,i,t){s.isUploadable?s._showUploadError(e,i,t):s._showError(e,i,t),s._setPreviewError(C,b)},(!s.filestack[b]||!g||f>=c&&m>=p)&&(g&&s.filestack[b]&&s._raise("fileimageresized",[_,b]),t.val++,t.val===a&&s._raise("fileimagesresized"),!g))return void o(s.msgImageResizeError,{id:_,index:b},"fileimageresizeerror");w=w||s.resizeDefaultImageType,r=c>f,n=p>m,u="width"===s.resizePreference?r?f/c:n?m/p:1:n?m/p:r?f/c:1,s._resetCanvas(),c*=u,p*=u,v.width=c,v.height=p;try{h.drawImage(d,0,0,c,p),v.toBlob(function(e){s.filestack[b]=e,s._raise("fileimageresized",[_,b]),t.val++,t.val===a&&s._raise("fileimagesresized",[void 0,void 0]),e instanceof Blob||o(s.msgImageResizeError,{id:_,index:b},"fileimageresizeerror")},w,s.resizeQuality)}catch(y){t.val++,t.val===a&&s._raise("fileimagesresized",[void 0,void 0]),l=s.msgImageResizeException.replace("{errors}",y.message),o(l,{id:_,index:b},"fileimageresizeexception")}},_initBrowse:function(e){var i=this;i.showBrowse?(i.$btnFile=e.find(".btn-file"),i.$btnFile.append(i.$element)):i.$element.hide()},_initCaption:function(){var e=this,t=e.initialCaption||"";return e.overwriteInitial||i.isEmpty(t)?(e.$caption.html(""),!1):(e._setCaption(t),!0)},_setCaption:function(t,a){var r,n,o,l,s=this,d=s.getFileStack();if(s.$caption.length){if(a)r=e("<div>"+s.msgValidationError+"</div>").text(),o=d.length,l=o?1===o&&d[0]?s._getFileNames()[0]:s._getMsgSelected(o):s._getMsgSelected(s.msgNo),n='<span class="'+s.msgValidationErrorClass+'">'+s.msgValidationErrorIcon+(i.isEmpty(t)?l:t)+"</span>";else{if(i.isEmpty(t))return;r=e("<div>"+t+"</div>").text(),n=s._getLayoutTemplate("fileIcon")+r}s.$caption.html(n),s.$caption.attr("title",r),s.$captionContainer.find(".file-caption-ellipsis").attr("title",r)}},_createContainer:function(){var i=this,t=e(document.createElement("div")).attr({"class":"file-input file-input-new"}).html(i._renderMain());return i.$element.before(t),i._initBrowse(t),i.theme&&t.addClass("theme-"+i.theme),t},_refreshContainer:function(){var e=this,i=e.$container;i.before(e.$element),i.html(e._renderMain()),e._initBrowse(i)},_renderMain:function(){var e=this,i=e.isUploadable&&e.dropZoneEnabled?" file-drop-zone":"file-drop-disabled",t=e.showClose?e._getLayoutTemplate("close"):"",a=e.showPreview?e._getLayoutTemplate("preview").replace(/\{class}/g,e.previewClass).replace(/\{dropClass}/g,i):"",r=e.isDisabled?e.captionClass+" file-caption-disabled":e.captionClass,n=e.captionTemplate.replace(/\{class}/g,r+" kv-fileinput-caption");return e.mainTemplate.replace(/\{class}/g,e.mainClass+(!e.showBrowse&&e.showCaption?" no-browse":"")).replace(/\{preview}/g,a).replace(/\{close}/g,t).replace(/\{caption}/g,n).replace(/\{upload}/g,e._renderButton("upload")).replace(/\{remove}/g,e._renderButton("remove")).replace(/\{cancel}/g,e._renderButton("cancel")).replace(/\{browse}/g,e._renderButton("browse"))},_renderButton:function(e){var t=this,a=t._getLayoutTemplate("btnDefault"),r=t[e+"Class"],n=t[e+"Title"],o=t[e+"Icon"],l=t[e+"Label"],s=t.isDisabled?" disabled":"",d="button";switch(e){case"remove":if(!t.showRemove)return"";break;case"cancel":if(!t.showCancel)return"";r+=" hide";break;case"upload":if(!t.showUpload)return"";t.isUploadable&&!t.isDisabled?a=t._getLayoutTemplate("btnLink").replace("{href}",t.uploadUrl):d="submit";break;case"browse":if(!t.showBrowse)return"";a=t._getLayoutTemplate("btnBrowse");
    break;default:return""}return r+="browse"===e?" btn-file":" fileinput-"+e+" fileinput-"+e+"-button",i.isEmpty(l)||(l=' <span class="'+t.buttonLabelClass+'">'+l+"</span>"),a.replace("{type}",d).replace("{css}",r).replace("{title}",n).replace("{status}",s).replace("{icon}",o).replace("{label}",l)},_renderThumbProgress:function(){var e=this;return'<div class="file-thumb-progress hide">'+e.progressTemplate.replace(/\{percent}/g,"0").replace(/\{status}/g,e.msgUploadBegin)+"</div>"},_renderFileFooter:function(e,t,a,r){var n,o=this,l=o.fileActionSettings,s=l.showRemove,d=l.showDrag,c=l.showUpload,p=l.showZoom,u=o._getLayoutTemplate("footer"),f=r?l.indicatorError:l.indicatorNew,m=r?l.indicatorErrorTitle:l.indicatorNewTitle;return t=o._getSize(t),n=o.isUploadable?u.replace(/\{actions}/g,o._renderFileActions(c,s,p,d,!1,!1,!1)).replace(/\{caption}/g,e).replace(/\{size}/g,t).replace(/\{width}/g,a).replace(/\{progress}/g,o._renderThumbProgress()).replace(/\{indicator}/g,f).replace(/\{indicatorTitle}/g,m):u.replace(/\{actions}/g,o._renderFileActions(!1,!1,p,d,!1,!1,!1)).replace(/\{caption}/g,e).replace(/\{size}/g,t).replace(/\{width}/g,a).replace(/\{progress}/g,"").replace(/\{indicator}/g,f).replace(/\{indicatorTitle}/g,m),n=i.replaceTags(n,o.previewThumbTags)},_renderFileActions:function(e,i,t,a,r,n,o,l){if(!(e||i||t||a))return"";var s,d=this,c=n===!1?"":' data-url="'+n+'"',p=o===!1?"":' data-key="'+o+'"',u="",f="",m="",g="",v=d._getLayoutTemplate("actions"),h=d.fileActionSettings,w=d.otherActionButtons.replace(/\{dataKey}/g,p),_=r?h.removeClass+" disabled":h.removeClass;return i&&(u=d._getLayoutTemplate("actionDelete").replace(/\{removeClass}/g,_).replace(/\{removeIcon}/g,h.removeIcon).replace(/\{removeTitle}/g,h.removeTitle).replace(/\{dataUrl}/g,c).replace(/\{dataKey}/g,p)),e&&(f=d._getLayoutTemplate("actionUpload").replace(/\{uploadClass}/g,h.uploadClass).replace(/\{uploadIcon}/g,h.uploadIcon).replace(/\{uploadTitle}/g,h.uploadTitle)),t&&(m=d._getLayoutTemplate("actionZoom").replace(/\{zoomClass}/g,h.zoomClass).replace(/\{zoomIcon}/g,h.zoomIcon).replace(/\{zoomTitle}/g,h.zoomTitle)),a&&l&&(s="drag-handle-init "+h.dragClass,g=d._getLayoutTemplate("actionDrag").replace(/\{dragClass}/g,s).replace(/\{dragTitle}/g,h.dragTitle).replace(/\{dragIcon}/g,h.dragIcon)),v.replace(/\{delete}/g,u).replace(/\{upload}/g,f).replace(/\{zoom}/g,m).replace(/\{drag}/g,g).replace(/\{other}/g,w)},_browse:function(e){var i=this;i._raise("filebrowse"),e&&e.isDefaultPrevented()||(i.isError&&!i.isUploadable&&i.clear(),i.$captionContainer.focus())},_filterDuplicate:function(e,i,t){var a=this,r=a._getFileId(e);r&&t&&t.indexOf(r)>-1||(t||(t=[]),i.push(e),t.push(r))},_change:function(t){var a=this,r=a.$element;if(!a.isUploadable&&i.isEmpty(r.val())&&a.fileInputCleared)return void(a.fileInputCleared=!1);a.fileInputCleared=!1;var n,o,l,s,d=[],c=arguments.length>1,p=a.isUploadable,u=c?t.originalEvent.dataTransfer.files:r.get(0).files,f=a.filestack.length,m=i.isEmpty(r.attr("multiple")),g=m&&f>0,v=0,h=a._getFileIds(),w=function(i,t,r,n){var o=e.extend(!0,{},a._getOutData({},{},u),{id:r,index:n}),l={id:r,index:n,file:t,files:u};return a.isUploadable?a._showUploadError(i,o):a._showError(i,l)};if(a.reader=null,a._resetUpload(),a._hideFileIcon(),a.isUploadable&&a.$container.find(".file-drop-zone ."+a.dropZoneTitleClass).remove(),c?e.each(u,function(e,i){i&&!i.type&&void 0!==i.size&&i.size%4096===0?v++:a._filterDuplicate(i,d,h)}):(u=t.target&&void 0===t.target.files?t.target.value?[{name:t.target.value.replace(/^.+\\/,"")}]:[]:t.target.files||{},e.each(u,function(e,i){a._filterDuplicate(i,d,h)})),i.isEmpty(d)||0===d.length)return p||a.clear(),a._showFolderError(v),void a._raise("fileselectnone");if(a._resetErrors(),s=d.length,o=a._getFileCount(a.isUploadable?a.getFileStack().length+s:s),a.maxFileCount>0&&o>a.maxFileCount){if(!a.autoReplace||s>a.maxFileCount)return l=a.autoReplace&&s>a.maxFileCount?s:o,n=a.msgFilesTooMany.replace("{m}",a.maxFileCount).replace("{n}",l),a.isError=w(n,null,null,null),a.$captionContainer.find(".kv-caption-icon").hide(),a._setCaption("",!0),void a.$container.removeClass("file-input-new file-input-ajax-new");o>a.maxFileCount&&a._resetPreviewThumbs(p)}else!p||g?(a._resetPreviewThumbs(!1),g&&a.clearStack()):!p||0!==f||a.previewCache.count()&&!a.overwriteInitial||a._resetPreviewThumbs(!0);a.isPreviewable?a._readFiles(d):a._updateFileDetails(1),a._showFolderError(v)},_abort:function(i){var t,a=this;return a.ajaxAborted&&"object"==typeof a.ajaxAborted&&void 0!==a.ajaxAborted.message?(t=e.extend(!0,{},a._getOutData(),i),t.abortData=a.ajaxAborted.data||{},t.abortMessage=a.ajaxAborted.message,a._setProgress(101,a.$progress,a.msgCancelled),a._showUploadError(a.ajaxAborted.message,t,"filecustomerror"),a.cancel(),!0):!1},_resetFileStack:function(){var t=this,a=0,r=[],n=[],o=[];t._getThumbs().each(function(){var l,s=e(this),d=s.attr("data-fileindex"),c=t.filestack[d],p=s.attr("id");"-1"!==d&&-1!==d&&(void 0!==c?(r[a]=c,n[a]=t._getFileName(c),o[a]=t._getFileId(c),s.attr({id:t.previewInitId+"-"+a,"data-fileindex":a}),a++):(l="uploaded-"+i.uniqId(),s.attr({id:l,"data-fileindex":"-1"}),t.$preview.find("#zoom-"+p).attr("id","zoom-"+l)))}),t.filestack=r,t.filenames=n,t.fileids=o},clearStack:function(){var e=this;return e.filestack=[],e.filenames=[],e.fileids=[],e.$element},updateStack:function(e,i){var t=this;return t.filestack[e]=i,t.filenames[e]=t._getFileName(i),t.fileids[e]=i&&t._getFileId(i)||null,t.$element},addToStack:function(e){var i=this;return i.filestack.push(e),i.filenames.push(i._getFileName(e)),i.fileids.push(i._getFileId(e)),i.$element},getFileStack:function(e){var i=this;return i.filestack.filter(function(i){return e?void 0!==i:void 0!==i&&null!==i})},getFilesCount:function(){var e=this,i=e.isUploadable?e.getFileStack().length:e.$element.get(0).files.length;return e._getFileCount(i)},lock:function(){var e=this;return e._resetErrors(),e.disable(),e.showRemove&&i.addCss(e.$container.find(".fileinput-remove"),"hide"),e.showCancel&&e.$container.find(".fileinput-cancel").removeClass("hide"),e._raise("filelock",[e.filestack,e._getExtraData()]),e.$element},unlock:function(e){var t=this;return void 0===e&&(e=!0),t.enable(),t.showCancel&&i.addCss(t.$container.find(".fileinput-cancel"),"hide"),t.showRemove&&t.$container.find(".fileinput-remove").removeClass("hide"),e&&t._resetFileStack(),t._raise("fileunlock",[t.filestack,t._getExtraData()]),t.$element},cancel:function(){var i,t=this,a=t.ajaxRequests,r=a.length;if(r>0)for(i=0;r>i;i+=1)t.cancelling=!0,a[i].abort();return t._setProgressCancelled(),t._getThumbs().each(function(){var i=e(this),a=i.attr("data-fileindex");i.removeClass("file-uploading"),void 0!==t.filestack[a]&&(i.find(".kv-file-upload").removeClass("disabled").removeAttr("disabled"),i.find(".kv-file-remove").removeClass("disabled").removeAttr("disabled")),t.unlock()}),t.$element},clear:function(){var t,a=this;if(a._raise("fileclear"))return a.$btnUpload.removeAttr("disabled"),a._getThumbs().find("video,audio,img").each(function(){i.cleanMemory(e(this))}),a._resetUpload(),a.clearStack(),a._clearFileInput(),a._resetErrors(!0),a._hasInitialPreview()?(a._showFileIcon(),a._resetPreview(),a._initPreviewActions(),a.$container.removeClass("file-input-new")):(a._getThumbs().each(function(){a._clearObjects(e(this))}),a.isUploadable&&(a.previewCache.data={}),a.$preview.html(""),t=!a.overwriteInitial&&a.initialCaption.length>0?a.initialCaption:"",a.$caption.html(t),a.$caption.attr("title",""),i.addCss(a.$container,"file-input-new"),a._validateDefaultPreview()),0===a.$container.find(i.FRAMES).length&&(a._initCaption()||a.$captionContainer.find(".kv-caption-icon").hide()),a._hideFileIcon(),a._raise("filecleared"),a.$captionContainer.focus(),a._setFileDropZoneTitle(),a.$element},reset:function(){var e=this;if(e._raise("filereset"))return e._resetPreview(),e.$container.find(".fileinput-filename").text(""),i.addCss(e.$container,"file-input-new"),(e.$preview.find(i.FRAMES).length||e.isUploadable&&e.dropZoneEnabled)&&e.$container.removeClass("file-input-new"),e._setFileDropZoneTitle(),e.clearStack(),e.formdata={},e.$element},disable:function(){var e=this;return e.isDisabled=!0,e._raise("filedisabled"),e.$element.attr("disabled","disabled"),e.$container.find(".kv-fileinput-caption").addClass("file-caption-disabled"),e.$container.find(".btn-file, .fileinput-remove, .fileinput-upload, .file-preview-frame button").attr("disabled",!0),e._initDragDrop(),e.$element},enable:function(){var e=this;return e.isDisabled=!1,e._raise("fileenabled"),e.$element.removeAttr("disabled"),e.$container.find(".kv-fileinput-caption").removeClass("file-caption-disabled"),e.$container.find(".btn-file, .fileinput-remove, .fileinput-upload, .file-preview-frame button").removeAttr("disabled"),e._initDragDrop(),e.$element},upload:function(){var t,a,r,n=this,o=n.getFileStack().length,l={},s=!e.isEmptyObject(n._getExtraData());if(n.isUploadable&&!n.isDisabled){if(n.minFileCount>0&&n._getFileCount(o)<n.minFileCount)return void n._noFilesError(l);if(n._resetUpload(),0===o&&!s)return void n._showUploadError(n.msgUploadEmpty);if(n.$progress.removeClass("hide"),n.uploadCount=0,n.uploadStatus={},n.uploadLog=[],n.lock(),n._setProgress(2),0===o&&s)return void n._uploadExtraOnly();if(r=n.filestack.length,n.hasInitData=!1,!n.uploadAsync)return n._uploadBatch(),n.$element;for(a=n._getOutData(),n._raise("filebatchpreupload",[a]),n.fileBatchCompleted=!1,n.uploadCache={content:[],config:[],tags:[],append:!0},n.uploadAsyncCount=n.getFileStack().length,t=0;r>t;t++)n.uploadCache.content[t]=null,n.uploadCache.config[t]=null,n.uploadCache.tags[t]=null;for(n.$preview.find(".file-preview-initial").removeClass(i.SORT_CSS),n._initSortable(),n.cacheInitialPreview=n.getPreview(),t=0;r>t;t++)void 0!==n.filestack[t]&&n._uploadSingle(t,n.filestack,!0)}},destroy:function(){var i=this,t=i.$form,a=i.$container,r=i.$element,n=i.namespace;return e(document).off(n),e(window).off(n),t&&t.length&&t.off(n),r.insertBefore(a).off(n).removeData(),a.off().remove(),r},refresh:function(i){var t=this,a=t.$element;return i=i?e.extend(!0,{},t.options,i):t.options,t.destroy(),a.fileinput(i),a.val()&&a.trigger("change.fileinput"),a},zoom:function(t){var a=this,r=e("#"+t),n=a.$modal;return r.length?(i.initModal(n),n.html(a._getModalContent()),a._setZoomContent(r),n.modal("show"),void a._initZoomButtons()):void a._log('Cannot zoom to detailed preview! Invalid frame with id: "'+t+'".')},getPreview:function(){var e=this;return{content:e.initialPreview,config:e.initialPreviewConfig,tags:e.initialPreviewThumbTags}}},e.fn.fileinput=function(a){if(i.hasFileAPISupport()||i.isIE(9)){var r=Array.apply(null,arguments),n=[];switch(r.shift(),this.each(function(){var o,l=e(this),s=l.data("fileinput"),d="object"==typeof a&&a,c=d.theme||l.data("theme"),p={},u={},f=d.language||l.data("language")||e.fn.fileinput.defaults.language||"en";s||(c&&(u=e.fn.fileinputThemes[c]||{}),"en"===f||i.isEmpty(e.fn.fileinputLocales[f])||(p=e.fn.fileinputLocales[f]||{}),o=e.extend(!0,{},e.fn.fileinput.defaults,u,e.fn.fileinputLocales.en,p,d,l.data()),s=new t(this,o),l.data("fileinput",s)),"string"==typeof a&&n.push(s[a].apply(s,r))}),n.length){case 0:return this;case 1:return n[0];default:return n}}},e.fn.fileinput.defaults={language:"en",showCaption:!0,showBrowse:!0,showPreview:!0,showRemove:!0,showUpload:!0,showCancel:!0,showClose:!0,showUploadedThumbs:!0,browseOnZoneClick:!1,autoReplace:!1,generateFileId:null,previewClass:"",captionClass:"",frameClass:"krajee-default",mainClass:"file-caption-main",mainTemplate:null,purifyHtml:!0,fileSizeGetter:null,initialCaption:"",initialPreview:[],initialPreviewDelimiter:"*$$*",initialPreviewAsData:!1,initialPreviewFileType:"image",initialPreviewConfig:[],initialPreviewThumbTags:[],previewThumbTags:{},initialPreviewShowDelete:!0,removeFromPreviewOnError:!1,deleteUrl:"",deleteExtraData:{},overwriteInitial:!0,previewZoomButtonIcons:{prev:'<i class="glyphicon glyphicon-triangle-left"></i>',next:'<i class="glyphicon glyphicon-triangle-right"></i>',toggleheader:'<i class="glyphicon glyphicon-resize-vertical"></i>',fullscreen:'<i class="glyphicon glyphicon-fullscreen"></i>',borderless:'<i class="glyphicon glyphicon-resize-full"></i>',close:'<i class="glyphicon glyphicon-remove"></i>'},previewZoomButtonClasses:{prev:"btn btn-navigate",next:"btn btn-navigate",toggleheader:"btn btn-default btn-header-toggle",fullscreen:"btn btn-default",borderless:"btn btn-default",close:"btn btn-default"},preferIconicPreview:!1,preferIconicZoomPreview:!1,allowedPreviewTypes:void 0,allowedPreviewMimeTypes:null,allowedFileTypes:null,allowedFileExtensions:null,defaultPreviewContent:null,customLayoutTags:{},customPreviewTags:{},previewFileIcon:'<i class="glyphicon glyphicon-file"></i>',previewFileIconClass:"file-other-icon",previewFileIconSettings:{},previewFileExtSettings:{},buttonLabelClass:"hidden-xs",browseIcon:'<i class="glyphicon glyphicon-folder-open"></i>&nbsp;',browseClass:"btn btn-primary",removeIcon:'<i class="glyphicon glyphicon-trash"></i>',removeClass:"btn btn-default",cancelIcon:'<i class="glyphicon glyphicon-ban-circle"></i>',cancelClass:"btn btn-default",uploadIcon:'<i class="glyphicon glyphicon-upload"></i>',uploadClass:"btn btn-default",uploadUrl:null,uploadAsync:!0,uploadExtraData:{},zoomModalHeight:480,minImageWidth:null,minImageHeight:null,maxImageWidth:null,maxImageHeight:null,resizeImage:!1,resizePreference:"width",resizeQuality:.92,resizeDefaultImageType:"image/jpeg",resizeIfSizeMoreThan:0,minFileSize:0,maxFileSize:0,maxFilePreviewSize:25600,minFileCount:0,maxFileCount:0,validateInitialCount:!1,msgValidationErrorClass:"text-danger",msgValidationErrorIcon:'<i class="glyphicon glyphicon-exclamation-sign"></i> ',msgErrorClass:"file-error-message",progressThumbClass:"progress-bar progress-bar-success progress-bar-striped active",progressClass:"progress-bar progress-bar-success progress-bar-striped active",progressCompleteClass:"progress-bar progress-bar-success",progressErrorClass:"progress-bar progress-bar-danger",progressUploadThreshold:99,previewFileType:"image",elCaptionContainer:null,elCaptionText:null,elPreviewContainer:null,elPreviewImage:null,elPreviewStatus:null,elErrorContainer:null,errorCloseButton:'<span class="close kv-error-close">&times;</span>',slugCallback:null,dropZoneEnabled:!0,dropZoneTitleClass:"file-drop-zone-title",fileActionSettings:{},otherActionButtons:"",textEncoding:"UTF-8",ajaxSettings:{},ajaxDeleteSettings:{},showAjaxErrorDetails:!0},e.fn.fileinputLocales.en={fileSingle:"file",filePlural:"files",browseLabel:"Browse &hellip;",removeLabel:"Remove",removeTitle:"Clear selected files",cancelLabel:"Cancel",cancelTitle:"Abort ongoing upload",uploadLabel:"Upload",uploadTitle:"Upload selected files",msgNo:"No",msgNoFilesSelected:"No files selected",msgCancelled:"Cancelled",msgZoomModalHeading:"Detailed Preview",msgSizeTooSmall:'File "{name}" (<b>{size} KB</b>) is too small and must be larger than <b>{minSize} KB</b>.',msgSizeTooLarge:'File "{name}" (<b>{size} KB</b>) exceeds maximum allowed upload size of <b>{maxSize} KB</b>.',msgFilesTooLess:"You must select at least <b>{n}</b> {files} to upload.",msgFilesTooMany:"Number of files selected for upload <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>.",msgFileNotFound:'File "{name}" not found!',msgFileSecured:'Security restrictions prevent reading the file "{name}".',msgFileNotReadable:'File "{name}" is not readable.',msgFilePreviewAborted:'File preview aborted for "{name}".',msgFilePreviewError:'An error occurred while reading the file "{name}".',msgInvalidFileName:'Invalid or unsupported characters in file name "{name}".',msgInvalidFileType:'Invalid type for file "{name}". Only "{types}" files are supported.',msgInvalidFileExtension:'Invalid extension for file "{name}". Only "{extensions}" files are supported.',msgFileTypes:{image:"image",html:"HTML",text:"text",video:"video",audio:"audio",flash:"flash",pdf:"PDF",object:"object"},msgUploadAborted:"The file upload was aborted",msgUploadThreshold:"Processing...",msgUploadBegin:"Initializing...",msgUploadEnd:"Done",msgUploadEmpty:"No valid data available for upload.",msgValidationError:"Validation Error",msgLoading:"Loading file {index} of {files} &hellip;",msgProgress:"Loading file {index} of {files} - {name} - {percent}% completed.",msgSelected:"{n} {files} selected",msgFoldersNotAllowed:"Drag & drop files only! {n} folder(s) dropped were skipped.",msgImageWidthSmall:'Width of image file "{name}" must be at least {size} px.',msgImageHeightSmall:'Height of image file "{name}" must be at least {size} px.',msgImageWidthLarge:'Width of image file "{name}" cannot exceed {size} px.',msgImageHeightLarge:'Height of image file "{name}" cannot exceed {size} px.',msgImageResizeError:"Could not get the image dimensions to resize.",msgImageResizeException:"Error while resizing the image.<pre>{errors}</pre>",msgAjaxError:"Something went wrong with the {operation} operation. Please try again later!",msgAjaxProgressError:"{operation} failed",ajaxOperations:{deleteThumb:"file delete",uploadThumb:"file upload",uploadBatch:"batch file upload",uploadExtra:"form data upload"},dropZoneTitle:"Drag & drop files here &hellip;",dropZoneClickTitle:"<br>(or click to select {files})",previewZoomButtonTitles:{prev:"View previous file",next:"View next file",toggleheader:"Toggle header",fullscreen:"Toggle full screen",borderless:"Toggle borderless mode",close:"Close detailed preview"}},e.fn.fileinput.Constructor=t,e(document).ready(function(){var i=e("input.file[type=file]");i.length&&i.fileinput()})});