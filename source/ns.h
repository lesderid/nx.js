#pragma once
#include "types.h"

typedef struct {
	size_t icon_size;
	NsApplicationControlData data;
} nx_app_t;

nx_app_t *nx_get_app(JSContext *ctx, JSValueConst obj);

void nx_init_ns(JSContext *ctx, JSValueConst init_obj);
