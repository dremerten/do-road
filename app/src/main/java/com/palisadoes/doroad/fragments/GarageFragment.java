package com.palisadoes.doroad.fragments;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.palisadoes.doroad.R;

/**
 * Created by stone on 9/10/17.
 */

public class GarageFragment extends Fragment {

    private View mView;


    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        mView = inflater.inflate(R.layout.frag_garage,container,false);


        return mView;
    }

    public static GarageFragment newInstance()
    {
        return new GarageFragment();
    }
}
