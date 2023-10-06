#pragma once
#include <stdbool.h>
#include <wasm3.h>
#include <pthread.h>
#include <quickjs/quickjs.h>
#include <cairo-ft.h>
#include <ft2build.h>
#include <poll.h>
#include <switch.h>
#include "thpool.h"
#include "poll.h"

#ifndef countof
#define countof(x) (sizeof(x) / sizeof((x)[0]))
#endif

#ifndef NXJS_VERSION
#define NXJS_VERSION "0.0.0"
#endif

// QuickJS doesn't have a way to get the version
// programatically, so it's hard-coded here
#define QUICKJS_VERSION "2021-03-27"

typedef int BOOL;

typedef struct nx_work_s nx_work_t;
typedef void (*nx_work_cb)(nx_work_t *req);
typedef void (*nx_after_work_cb)(JSContext *ctx, nx_work_t *req, JSValue *args);

struct nx_work_s
{
    nx_work_t *next;
    int done;
    JSValue js_callback;
    nx_work_cb work_cb;
    nx_after_work_cb after_work_cb;
    pthread_mutex_t *async_done_mutex;
    void *data;
};

typedef struct
{
    nx_poll_t poll;
    threadpool thpool;
    pthread_mutex_t async_done_mutex;
    nx_work_t *work_queue;
    FT_Library ft_library;
    HidVibrationDeviceHandle vibration_device_handles[2];
    IM3Environment wasm_env;
} nx_context_t;

inline nx_context_t *nx_get_context(JSContext *ctx)
{
    return JS_GetContextOpaque(ctx);
}
