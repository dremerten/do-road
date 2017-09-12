package com.palisadoes.doroad.fragments;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.palisadoes.doroad.R;
import com.palisadoes.doroad.adapters.RequestListAdapter;
import com.palisadoes.doroad.models.Request;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by stone on 9/10/17.
 */

public class ReqeustFragment extends Fragment {

    private View mView;
    private RecyclerView mRequestListView;
    private RequestListAdapter mRequestListAdapter;
    private List<Request> mRequests;
    private FirebaseAuth mAuth;
    private FirebaseAuth.AuthStateListener mAuthListener;
    private FirebaseUser mUser;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        mView = inflater.inflate(R.layout.frag_request,container,false);

        mRequests = new ArrayList<>();

        mAuth = FirebaseAuth.getInstance();
        mAuthListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                mUser = firebaseAuth.getCurrentUser();

            }
        };

        //mRequests.add(new Request("Name1","9PM"));
        //mRequests.add(new Request("Name2","9PM"));
        //mRequests.add(new Request("Name3","9PM"));

        initViews();
        setUpRecyclerView();
        getRequests();

        return mView;
    }

    public static ReqeustFragment newInstance()
    {
        return new ReqeustFragment();
    }

    private void initViews()
    {
        mRequestListView = (RecyclerView) mView.findViewById(R.id.requestList);
    }

    private void setUpRecyclerView()
    {
        mRequestListAdapter = new RequestListAdapter(mRequests,mView.getContext());
        mRequestListView.setHasFixedSize(true);
        mRequestListView.setLayoutManager(new LinearLayoutManager(mView.getContext()));
        mRequestListView.setAdapter(mRequestListAdapter);
    }

    private void getRequests()
    {
        mUser = mAuth.getCurrentUser();
        if(mUser!=null) {
            Toast.makeText(getActivity(),"user not null",Toast.LENGTH_SHORT).show();
            final FirebaseDatabase firebaseDatabase = FirebaseDatabase.getInstance();
            final DatabaseReference reference = firebaseDatabase.getReference()
                    .child("drivers").child(mUser.getUid()).child("requests");

            reference.addValueEventListener(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    Map<String, Object> objectMap = (HashMap<String, Object>)
                            dataSnapshot.getValue();

                    Iterator it = objectMap.entrySet().iterator();
                    while (it.hasNext()) {
                        Map.Entry pair = (Map.Entry)it.next();
                        String passengerId = (String) pair.getKey();
                        Map<String, Object> mapObj = (Map<String, Object>) pair.getValue();
                        final double dropoffLat = (Double) mapObj.get("dropoffLat");
                        final double dropoffLng = (Double) mapObj.get("dropoffLng");
                        final double pickUpLat = (Double) mapObj.get("pickUpLat");
                        final double pickUpLng =(Double) mapObj.get("pickUpLng");
                        String status = (String) mapObj.get("status");
                        final String datetime = "9:30pm";

                        Toast.makeText(getActivity(),dropoffLat+"",Toast.LENGTH_SHORT).show();
                        //final String datetime = (String) mapObj.get("datetime");

                        final DatabaseReference ref = firebaseDatabase.getReference()
                                .child("passengers").child(passengerId);

                        ref.addListenerForSingleValueEvent(new ValueEventListener() {
                            @Override
                            public void onDataChange(DataSnapshot dataSnapshot) {
                                Map<String, Object> mapObj = (Map<String, Object>) dataSnapshot.getValue();
                                String name = (String) mapObj.get("name");
                                String phone = (String) mapObj.get("phone");

                                //Toast.makeText(getActivity(),name,Toast.LENGTH_SHORT).show();
                                mRequests.add(new Request(name,phone,pickUpLat,pickUpLng,dropoffLat,dropoffLng,datetime));
                                //Toast.makeText(getActivity(),mRequests.get(0).getName(),Toast.LENGTH_SHORT).show();
                                mRequestListAdapter.updateRequests(mRequests);

                            }

                            @Override
                            public void onCancelled(DatabaseError databaseError) {
                            }
                        });
                        Toast.makeText(getActivity(),"Hello",Toast.LENGTH_SHORT).show();

                    }
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {

                }
            });


        }


    }




}
