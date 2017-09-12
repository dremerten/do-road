package com.palisadoes.doroad;

import android.app.Application;
import android.content.Context;

/**
 * Created by stone on 1/4/17.
 */

public class MyApplication extends Application {

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        //MultiDex.install(this);
    }




}
