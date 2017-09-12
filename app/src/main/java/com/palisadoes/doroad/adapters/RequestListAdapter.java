package com.palisadoes.doroad.adapters;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.media.Image;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.amulyakhare.textdrawable.TextDrawable;
import com.amulyakhare.textdrawable.util.ColorGenerator;
import com.palisadoes.doroad.R;
import com.palisadoes.doroad.models.Request;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by stone on 9/11/17.
 */

public class RequestListAdapter extends RecyclerView.Adapter<RequestListAdapter.RequestViewHolder> {


    public static class RequestViewHolder extends RecyclerView.ViewHolder
    {
        private TextView tvName;
        private TextView tvTime;
        private ImageView imgIcon;

        public RequestViewHolder(View view) {
            super(view);
            tvName = (TextView) view.findViewById(R.id.request_name);
            tvTime = (TextView) view.findViewById(R.id.request_datetime);
            imgIcon = (ImageView) view.findViewById(R.id.imageView1);
        }
    }

    List<Request> mRequests;
    private Context mContext;

    public RequestListAdapter(List<Request> requests, Context context)
    {
        this.mRequests = new ArrayList<>(requests);
        this.mContext = context;
    }

    @Override
    public RequestViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.list_request_item,parent,false);

        RequestViewHolder requestViewHolder = new RequestViewHolder(view);

        return requestViewHolder;
    }

    @Override
    public void onBindViewHolder(RequestViewHolder holder, int position) {

        Request request = mRequests.get(position);

        String name = request.getName();
        holder.tvName.setText(request.getName());
        holder.tvTime.setText(request.getDatetime());

        char firstLetter =  name.toUpperCase().charAt(0);

        ColorGenerator generator = ColorGenerator.MATERIAL;

        int color2 = generator.getColor(name);

        TextDrawable drawable2 =
                TextDrawable.builder()
                        .beginConfig()
                        .textColor(Color.WHITE)
                        .useFont(Typeface.DEFAULT)
                        .toUpperCase()
                        .endConfig()
                        .buildRound(firstLetter + "", color2);

        holder.imgIcon.setImageDrawable(drawable2);
    }

    @Override
    public int getItemCount() {
        return mRequests.size();
    }

    public void updateRequests(List<Request> requests)
    {
        mRequests = new ArrayList<>(requests);
        notifyDataSetChanged();
    }
}
