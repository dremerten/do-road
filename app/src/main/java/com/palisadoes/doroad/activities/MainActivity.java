package com.palisadoes.doroad.activities;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.palisadoes.doroad.R;
import com.palisadoes.doroad.fragments.GarageFragment;
import com.palisadoes.doroad.fragments.MapFrag;
import com.palisadoes.doroad.fragments.ReqeustFragment;
import com.palisadoes.doroad.fragments.TripFragment;
import com.palisadoes.doroad.models.Driver;

import java.util.HashMap;

import constants.Constants;


public class MainActivity extends AppCompatActivity
        implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener,
        LocationListener {

    //private TextView lngText, latText;
    private FirebaseAuth mAuth;
    private FirebaseAuth.AuthStateListener mAuthListener;
    private GoogleApiClient mGoogleApiClient;
    private boolean isSignedIn=false;
    private Context context;
    //private Button button;
    private Location mLocation;
    private LocationRequest mLocationRequest;
    private SharedPreferences mSharedPrefs;
    private String mFirstName,mLastName,mVehicleType,mRoute;
    private BottomNavigationView bottomNavigationView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar tb = (Toolbar)findViewById(R.id.toolbar);
        setSupportActionBar(tb);

        if (!hasGooglePlayServices()) {
            Toast.makeText(this, "Google play services not found.", Toast.LENGTH_LONG).show();
            return;
        }

        context = this;

        mAuth = FirebaseAuth.getInstance();
        mAuthListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser user = firebaseAuth.getCurrentUser();
                if (user != null) {
                    // User is signed in
                    isSignedIn = true;
                    Toast.makeText(context,"User present main",Toast.LENGTH_SHORT).show();
                    Log.d(Constants.LOGGER, "onAuthStateChanged:signed_in:" + user.getUid());
                } else {
                    // User is signed out
                    isSignedIn = false;
                    Toast.makeText(context,"User not present main",Toast.LENGTH_SHORT).show();
                    Log.d(Constants.LOGGER, "onAuthStateChanged:signed_out");
                }

            }
        };

        mSharedPrefs = getSharedPreferences("SHARED_PREFS",Context.MODE_PRIVATE);
        getDriverProfile();
        checkPermissions();

        initViews();

        bottomNavigationView.setOnNavigationItemSelectedListener(
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        Fragment selectedFragment = null;
                        switch (item.getItemId()) {
                            case R.id.action_home:
                                selectedFragment = ReqeustFragment.newInstance();
                                break;

                            case R.id.action_map:
                                selectedFragment = MapFrag.newInstance();
                                break;

                            case R.id.action_garage:
                                selectedFragment = GarageFragment.newInstance();
                                break;

                            case R.id.action_trip:
                                selectedFragment = TripFragment.newInstance();
                                break;

                        }
                        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                        transaction.replace(R.id.frame_layout, selectedFragment);
                        transaction.commit();
                        return true;
                    }
                });

        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.frame_layout, ReqeustFragment.newInstance());
        transaction.commit();

       /* button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
               getCoords(mLocation);
            }
        });*/
    }

    private void getDriverProfile()
    {
        mFirstName = mSharedPrefs.getString("firstname",null);
        mLastName = mSharedPrefs.getString("lastname",null);
        mVehicleType = mSharedPrefs.getString("vehicle_type",null);
        mRoute = mSharedPrefs.getString("route",null);
    }


    private void initViews()
    {
        bottomNavigationView = (BottomNavigationView) findViewById(R.id.bottom_navigation);
        //button = (Button) findViewById(R.id.button2);
       // latText = (TextView) findViewById(R.id.latitude);
       // lngText = (TextView) findViewById(R.id.longitude);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mGoogleApiClient != null) {
            mGoogleApiClient.disconnect();
        }
    }






    private void checkPermissions() {
        if (isPermissionGranted(this, Manifest.permission.ACCESS_FINE_LOCATION)) {
            setUpGoogleApiClient();
        } else {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 100);
        }
    }

    synchronized void setUpGoogleApiClient() {
        mGoogleApiClient = new GoogleApiClient.Builder(this).addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this).addApi(LocationServices.API).build();
        mGoogleApiClient.connect();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String permissions[],
                                           @NonNull int[] grantResults) {
        switch (requestCode) {
            case 100: {
                if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    setUpGoogleApiClient();
                } else {
                    Toast.makeText(this, "Permission Denied!", Toast.LENGTH_SHORT).show();
                }
            }
            break;
        }
    }

    @SuppressWarnings("MissingPermission")
    @Override
    public void onConnected(@Nullable Bundle bundle) {
        mLocationRequest = LocationRequest.create();
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setInterval(1000); // Intervals millis
        mLocationRequest.setFastestInterval(500); //If avaible sooner

        if (!isPermissionGranted(this, Manifest.permission.ACCESS_FINE_LOCATION)) {
            return;
        }

        if (!checkGPSisOpen()) {
            Toast.makeText(this, "Enable location services for accurate data.", Toast.LENGTH_SHORT)
                    .show();
            Intent viewIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            startActivity(viewIntent);
        } else {
            LocationServices.FusedLocationApi
                    .requestLocationUpdates(mGoogleApiClient, mLocationRequest, this);

            mLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);

            getCoords(LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient));
        }
    }

    //Coordinates Getter
    private void getCoords(Location location) {
        if (location != null) {
            double latitude = location.getLatitude();
            double longitude = location.getLongitude();

            postUserLocationToDatabase(latitude,longitude);

            //latText.setText(latitude+"");
           // lngText.setText(longitude+"");


        }
    }


    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onLocationChanged(Location location) {
        getCoords(location);
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        setUpGoogleApiClient();
    }

    //If GooglePlay Services is active
    private boolean hasGooglePlayServices() {
        return GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(this) ==
                ConnectionResult.SUCCESS;
    }

    //
    private boolean checkGPSisOpen() {
        LocationManager manager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        return manager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
                manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    }


    public static boolean isPermissionGranted(Context context, String permission) {
        return ContextCompat.checkSelfPermission(context, permission) ==
                PackageManager.PERMISSION_GRANTED;
    }


    private void postUserLocationToDatabase(final double latitude, final double longitude)
    {
        final FirebaseUser user = mAuth.getCurrentUser();


        if(user!=null)
        {
            FirebaseDatabase firebaseDatabase = FirebaseDatabase.getInstance();
            final DatabaseReference reference = firebaseDatabase.getReference().child("drivers");

            reference.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    if(dataSnapshot.hasChild(user.getUid()))
                    {
                        HashMap<String,Object> hashMap = new HashMap();
                        hashMap.put("latitude",latitude);
                        hashMap.put("longitude",longitude);
                        reference.child(user.getUid()).updateChildren(hashMap);
                    }else{
                        reference.child(user.getUid()).setValue(new
                                Driver(user.getUid(),
                                new Driver.DriverProfile(mFirstName,mLastName,mVehicleType,mRoute),latitude,longitude));
                    }
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {

                }
            });


        }else{
            Toast.makeText(context,"Didnt worked",Toast.LENGTH_SHORT).show();

        }

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }







}